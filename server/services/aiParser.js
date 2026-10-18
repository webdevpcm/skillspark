import Skill from '../models/Skill.js';

/**
 * Fallback parser using regex keyword matching against the Skill collection
 */
export async function fallbackKeywordParser(text, allSkills) {
  const lowerText = text.toLowerCase();

  // Experience level detection
  let experienceLevel = 'Junior';
  if (/student|intern\b/i.test(lowerText)) {
    experienceLevel = 'Student';
  } else if (/fresher|entry[\s-]level|graduate\b/i.test(lowerText)) {
    experienceLevel = 'Fresher';
  } else if (/mid[\s-]level|intermediate|\b3\+?\s*years/i.test(lowerText)) {
    experienceLevel = 'Mid';
  } else if (/junior|\b1\+?\s*years|\b2\+?\s*years/i.test(lowerText)) {
    experienceLevel = 'Junior';
  }

  // Role detection
  let role = 'Software Engineer';
  const roleMatches = [
    { regex: /frontend\s+(?:developer|engineer|intern)/i, title: 'Frontend Developer' },
    { regex: /backend\s+(?:developer|engineer|intern)/i, title: 'Backend Developer' },
    { regex: /full[\s-]stack\s+(?:developer|engineer)/i, title: 'Full Stack Engineer' },
    { regex: /ui[\s/_-]?ux|product\s+designer/i, title: 'UI/UX Designer' },
    { regex: /data\s+(?:analyst|scientist|engineer)/i, title: 'Data Analyst' },
    { regex: /product\s+manager/i, title: 'Product Manager' },
    { regex: /devops\s+engineer|cloud\s+engineer/i, title: 'DevOps Engineer' },
    { regex: /mobile\s+(?:developer|engineer)/i, title: 'Mobile App Developer' },
    { regex: /digital\s+marketer|seo\s+specialist/i, title: 'Digital Marketing Specialist' }
  ];

  for (const match of roleMatches) {
    if (match.regex.test(text)) {
      role = match.title;
      break;
    }
  }

  // Split into sections if possible to distinguish required vs nice-to-have
  const niceToHaveSectionRegex = /(?:nice to have|plus|bonus|preferred|good to have)[\s\S]*/i;
  const niceMatch = text.match(niceToHaveSectionRegex);
  const niceText = niceMatch ? niceMatch[0].toLowerCase() : '';
  const mainText = niceMatch ? text.substring(0, niceMatch.index).toLowerCase() : lowerText;

  const matchedRequired = new Set();
  const matchedNice = new Set();

  for (const skill of allSkills) {
    const candidates = [skill.name, ...(skill.aliases || [])];
    for (const c of candidates) {
      if (!c || c.length < 2) continue;
      // Word boundary regex escape
      const escaped = c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(`(?:^|[^a-zA-Z0-9_#+])${escaped}(?:$|[^a-zA-Z0-9_#+])`, 'i');

      if (pattern.test(niceText)) {
        matchedNice.add(skill.name);
        break;
      } else if (pattern.test(mainText)) {
        matchedRequired.add(skill.name);
        break;
      }
    }
  }

  // If nice has overlap with required, remove from nice
  matchedRequired.forEach(s => matchedNice.delete(s));

  return {
    role,
    requiredSkills: Array.from(matchedRequired),
    niceToHave: Array.from(matchedNice),
    experienceLevel
  };
}

/**
 * Main parseJobDescription function
 */
export async function parseJobDescription(text) {
  if (!text || typeof text !== 'string') {
    return {
      role: '',
      requiredSkills: [],
      niceToHave: [],
      experienceLevel: 'Junior'
    };
  }

  // Fetch all known skills from the DB
  const allSkills = await Skill.find({}).lean();
  const validSkillNames = new Map();
  allSkills.forEach(s => {
    validSkillNames.set(s.name.toLowerCase(), s.name);
    (s.aliases || []).forEach(alias => {
      validSkillNames.set(alias.toLowerCase(), s.name);
    });
  });

  const aiEnabled = process.env.AI_PARSE_ENABLED === 'true';
  const apiKey = process.env.LLM_API_KEY;
  const endpoint = process.env.LLM_ENDPOINT || (process.env.LLM_BASE_URL ? `${process.env.LLM_BASE_URL}/chat/completions` : 'https://api.openai.com/v1/chat/completions');

  if (aiEnabled && apiKey) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: process.env.LLM_MODEL || 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You extract job details from descriptions. You MUST return ONLY valid raw JSON with keys: "role" (string), "requiredSkills" (array of strings), "niceToHave" (array of strings), "experienceLevel" (one of: "Student", "Fresher", "Junior", "Mid"). Do not include markdown codeblocks.'
            },
            {
              role: 'user',
              content: text.slice(0, 4000)
            }
          ],
          temperature: 0.1
        })
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content?.trim();
        const cleaned = content.replace(/^```json/, '').replace(/```$/, '').trim();
        const parsed = JSON.parse(cleaned);

        // Filter returned skills against existing skills in Skill collection
        const filterSkills = (arr) => {
          if (!Array.isArray(arr)) return [];
          const valid = new Set();
          arr.forEach(item => {
            const match = validSkillNames.get(item.toLowerCase().trim());
            if (match) valid.add(match);
          });
          return Array.from(valid);
        };

        const requiredSkills = filterSkills(parsed.requiredSkills);
        const niceToHave = filterSkills(parsed.niceToHave);

        const allowedLevels = ['Student', 'Fresher', 'Junior', 'Mid'];
        const experienceLevel = allowedLevels.includes(parsed.experienceLevel) ? parsed.experienceLevel : 'Junior';

        return {
          role: parsed.role || 'Opportunity',
          requiredSkills,
          niceToHave,
          experienceLevel
        };
      }
    } catch (llmError) {
      console.warn('AI Parsing failed, falling back to keyword matcher:', llmError.message);
    }
  }

  // Fallback to keyword matching
  return fallbackKeywordParser(text, allSkills);
}
