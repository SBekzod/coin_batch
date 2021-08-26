const MySQL = require('../models/mysql2');
const moment = require('moment');

class TotalBet {

    constructor(data) {
        this.pairs_data = {};
        this.data = data;
        this.db = new MySQL();
    }

    //TODO: GETTING TICK DATA FOR THE REQUIRED MOMENT
    async gettingTargetTickData(timestamp) {

        try {

            let first_data = await this.db.getTargetTickData(timestamp, this.data.first_coin);
            let second_data = await this.db.getTargetTickData(timestamp, this.data.second_coin);
            first_data.coin_type = this.data.first_coin;
            second_data.coin_type = this.data.second_coin;
            this.pairs_data = {first_data: first_data, second_data: second_data}

            // inserting the shoots data
            return await this.prepareShootDataOfPairs(this.pairs_data);

        } catch (err) {
            throw err;
        }

    }

    async prepareShootDataOfPairs(pair_coins_data) {
        try {

            let ele = pair_coins_data['first_data'];
            ele.summary = this.cumulateDigits(ele);
            let ele_second = pair_coins_data['second_data'];
            ele_second.summary = this.cumulateDigits(ele_second);

            let times = moment(parseInt(ele['binstamp'])),
                hour = this.shapingTime(times.hour()),
                minutes = this.shapingTime(times.minutes()),
                seconds = this.shapingTime(times.seconds()),
                key = `${hour}:${minutes}:${seconds}`,
                round = hour * 12 + Math.floor(parseInt(minutes) / 5) + 1;

            await this.db.setPairsShootData(this.data.pairs_order, ele, ele_second, key, round);
            return {time: key, round: round}

        } catch (err) {
            console.log('ERROR prepareShootDataOfPairs');
            throw err;
        }
    }

    shapingTime(value) {
        if (value == 0) {
            return '00';
        } else if (value > 0 && value < 10) {
            return `0${value}`;
        } else {
            return value;
        }
    }

    cumulateDigits(ele) {
        let summary = 0, numb, numb_volume;

        numb = Math.round(ele.close * 100) % 100;
        if (numb < 10) {
            summary = numb;
        } else if (numb >= 10 && numb < 100) {
            summary = numb % 10;
        }

        if (ele['coin_type'] === 'btc') {

            // adding the volume data amount final digit
            numb_volume = Math.round(ele.volume * 1000000) % 100;
            if (numb_volume < 10) {
                summary += numb_volume;
            } else if (numb_volume >= 10 && numb_volume < 100) {
                summary += numb_volume % 10;
            }
            if (summary > 10) summary = summary % 10;
        } else if (ele['coin_type'] === 'bnb') {

            // adding the volume data amount final digit
            numb_volume = Math.round(ele.volume * 10000) % 100;
            if (numb_volume < 10) {
                summary += numb_volume;
            } else if (numb_volume >= 10 && numb_volume < 100) {
                summary += numb_volume % 10;
            }
            if (summary > 10) summary = summary % 10;
        } else {

            // adding the volume data amount final digit
            numb_volume = Math.round(ele.volume * 100000) % 100;
            if (numb_volume < 10) {
                summary += numb_volume;
            } else if (numb_volume >= 10 && numb_volume < 100) {
                summary += numb_volume % 10;
            }
            if (summary > 10) summary = summary % 10;
        }

        return summary;
    }


}

module.exports = TotalBet;