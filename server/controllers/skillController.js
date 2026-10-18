import Skill from '../models/Skill.js';

export async function getSkills(req, res, next) {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { aliases: { $regex: search, $options: 'i' } }
      ];
    }

    const skills = await Skill.find(query).sort({ category: 1, name: 1 });
    res.json({
      success: true,
      count: skills.length,
      skills
    });
  } catch (error) {
    next(error);
  }
}
