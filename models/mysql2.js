const mysql = require('mysql2/promise');

class MySql {
    constructor() {
        this.con = null;
    }

    async connection() {
        this.con = await mysql.createPool({
            host: process.env.NTRY_DATABASE_HOST,
            user: process.env.NTRY_DATABASE_USERNAME,
            password: process.env.NTRY_DATABASE_PASSWORD,
            port: process.env.NTRY_DATABASE_PORT,
            database: process.env.NTRY_DATABASE_NAME,
            waitForConnections: true,
            queueLimit: 0,
        })
    }

    async getCoinData() {
        if (!this.con) await this.connection();
        const query_result = await this.con.query('select * from bitcoin_price_collection');
        return query_result[0][0];
    }

    async getTargetTickData(timestamp, coin_type) {
        try {
            let type = coin_type;
            if (!this.con) await this.connection();
            switch (type) {
                case 'btc' :
                    type = 'bitcoin';
                    break;
                case 'eth' :
                    type = 'ethereum';
                    break;
                case 'bnb' :
                    break;
                default:
                    break;
            }

            const sql = `select * from ${type}_tick_collection where binstamp < ? ORDER BY id DESC LIMIT 10`
            const query_result = await this.con.query(sql, [timestamp]);
            let target_data = query_result[0][0];

            return target_data;
        } catch (err) {
            console.log('ERROR getTargetTickData');
        }
    }

    async setPairsShootData(pairs_order, fir_coin, sec_coin, key, round) {
        try {
            const sql = `INSERT INTO total_${pairs_order}_shoots SET time_local = ?, round = ?, close_${fir_coin.coin_type} = ?, close_${sec_coin.coin_type} = ?, vol_${fir_coin.coin_type} = ?, vol_${sec_coin.coin_type} =?, shoot_sum_${fir_coin.coin_type} = ?, shoot_sum_${sec_coin.coin_type} =?, timestamps_${fir_coin.coin_type} =?, timestamps_${sec_coin.coin_type} = ?`;
            await this.con.query(sql, [key, round, fir_coin.close, sec_coin.close, fir_coin.volume, sec_coin.volume, fir_coin.summary, sec_coin.summary, fir_coin['binstamp'], sec_coin['binstamp']])
            return true
        } catch (err) {
            console.log('ERROR setPairsShootData');
            console.log(err);
            throw err;
        }
    }

    async getAllShoots(pairs_order, quantity) {
        try {
            if (!this.con) await this.connection();
            const query_result = await this.con.query(`select * from total_${pairs_order}_shoots ORDER BY id DESC LIMIT ${quantity}`);
            return query_result[0];
        } catch (err) {
            console.log('ERROR :: getAllShoots');
            throw err;
        }
    }

    async getAllTotalWins(pairs_order, quantity) {
        try {
            if (!this.con) await this.connection();
            const query_result = await this.con.query(`select * from result_total_${pairs_order} ORDER BY id DESC LIMIT ${quantity}`);
            return query_result[0];
        } catch (err) {
            console.log('ERROR :: getAllShoots');
            throw err;
        }
    }

    async getAllRoundShoots(data, cur_round, st_stamp) {
        try {
            if (!this.con) await this.connection();
            let sql = `select * from total_${data.pairs_order}_shoots where round = ? and timestamps_${data.first_coin} > ? ORDER BY id DESC LIMIT 10`;
            const query_result = await this.con.query(sql, [cur_round, st_stamp]);
            return query_result[0];
        } catch(err) {
            console.log('ERROR :: getAllRoundShoots');
            throw err;
        }

    }

    async setRoundWinner(data) {
        try {
            if (!this.con) await this.connection();
            const sql = `INSERT INTO  result_total_${data.pairs_data.pairs_order} SET round = ?, sum_${data.pairs_data.first_coin} = ?, sum_${data.pairs_data.second_coin} = ?, winner = ?`;
            await this.con.query(sql, [data.round, data.sum_first, data.sum_second, data.winner]);
            return true;
        } catch(err) {
            console.log('ERROR :: setRoundWinner');
            throw err;
        }
    }


}

module.exports = MySql;





