const MySQL = require('../models/mysql2');
const moment = require('moment');

class Total_winner {

    constructor(data, round) {
        this.db = new MySQL();
        this.data = data;
        this.cur_round = round;
    }

    async getShootsSetWinner() {
        try {
            const st_stamp = moment().add(-5, 'minute').valueOf();
            const result = await this.db.getAllRoundShoots(this.data, this.cur_round, st_stamp);
            await this.findAndSetRoundWinner(result);
            return true;
        } catch (err) {
            throw err;
        }
    }

    async findAndSetRoundWinner(list) {
        try {
            let sum_first = 0, sum_second = 0;
            list.forEach(ele => {
                sum_first += ele[`shoot_sum_${this.data.first_coin}`];
                sum_second += ele[`shoot_sum_${this.data.second_coin}`];
            })

            if (sum_first > sum_second) {
                await this.db.setRoundWinner({round: this.cur_round, sum_first: sum_first, sum_second: sum_second, winner: this.data.first_coin, pairs_data: this.data});
            } else if (sum_first < sum_second) {
                await this.db.setRoundWinner({round: this.cur_round, sum_first: sum_first, sum_second: sum_second, winner: this.data.second_coin, pairs_data: this.data});
            } else {
                await this.db.setRoundWinner({round: this.cur_round, sum_first: sum_first, sum_second: sum_second, winner: 'none', pairs_data: this.data});
            }
            return true;

        } catch (err) {
            throw err;
        }
    }


}

module.exports = Total_winner;