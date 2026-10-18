import { test, describe, it } from 'node:test';
import assert from 'node:assert';
import { scoreJob } from '../services/matching.js';

describe('SkillSpark Matching Engine', () => {
  const sampleUser = {
    skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Git'],
    experienceLevel: 'Fresher'
  };

  it('Frontend Intern should score 100 with all required, nice-to-have, and level matching', () => {
    const job = {
      title: 'Frontend Intern',
      requiredSkills: ['React', 'JavaScript', 'HTML', 'CSS'],
      niceToHave: ['Git'],
      levels: ['Fresher', 'Student']
    };

    const result = scoreJob(sampleUser, job);

    assert.strictEqual(result.score, 100, `Expected score 100, got ${result.score}`);
    assert.deepStrictEqual(result.missing, []);
    assert.strictEqual(result.matched.length, 5);
    assert.ok(result.reason.includes('4 of 4 required skills match'));
  });

  it('UI/UX Designer should score 53 with missing Figma and Adobe XD', () => {
    const job = {
      title: 'UI/UX Designer',
      requiredSkills: ['Figma', 'Adobe XD', 'CSS'],
      niceToHave: ['HTML'],
      levels: ['Fresher']
    };

    const result = scoreJob(sampleUser, job);

    assert.strictEqual(result.score, 53, `Expected score 53, got ${result.score}`);
    assert.deepStrictEqual(result.missing, ['Figma', 'Adobe XD']);
    assert.ok(result.matched.includes('CSS'));
    assert.ok(result.matched.includes('HTML'));
  });

  it('Backend Developer should have 0 required skills matched and low score', () => {
    const job = {
      title: 'Backend Developer',
      requiredSkills: ['Node.js', 'MongoDB', 'Express'],
      niceToHave: [],
      levels: ['Junior']
    };

    const result = scoreJob(sampleUser, job);

    assert.strictEqual(result.score, 0);
    assert.strictEqual(result.matched.length, 0);
    assert.strictEqual(result.missing.length, 3);
  });

  it('Works with seekerProfile sub-document structure', () => {
    const userWithSubDoc = {
      seekerProfile: {
        skills: ['Python', 'SQL', 'Data Analysis'],
        experienceLevel: 'Junior'
      }
    };

    const job = {
      title: 'Data Analyst',
      requiredSkills: ['Python', 'SQL'],
      niceToHave: ['Excel'],
      levels: ['Junior', 'Mid']
    };

    const result = scoreJob(userWithSubDoc, job);
    // 70 * (2/2) + 0 + 10 = 80
    assert.strictEqual(result.score, 80);
    assert.ok(result.matched.includes('Python'));
    assert.ok(result.matched.includes('SQL'));
  });
});
