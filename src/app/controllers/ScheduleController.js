import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../model/Appointment';
import USer from '../model/User';

class ScheduleController {
  async index(req, res) {
    const userProvider = await USer.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!userProvider) {
      return res.status(401).json({ error: 'User is  not a provider' });
    }

    const { date } = req.query;
    const parsedDate = parseISO(date);

    const appointmensts = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        // 2019-11-11T00:00:00-03:00
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      order: ['date'],
    });

    return res.json(appointmensts);
  }
}

export default new ScheduleController();
