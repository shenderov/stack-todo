import { InfluxDB, Point } from '@influxdata/influxdb-client'

const url = process.env['INFLUX_URL'] || 'https://us-east-1-1.aws.cloud2.influxdata.com';
const token = process.env['INFLUX_TOKEN'] || 'token';
const org = process.env['INFLUX_ORG'] || 'selenium';
const bucket = process.env['INFLUX_BUCKET'] || 'stacktodo';

export const send = async function (specName, testName, status, duration) {
        const influxDB = new InfluxDB({ url, token });
        const writeApi = influxDB.getWriteApi(org, bucket);
        const point = new Point('spec')
            .tag('spec', specName)
            .stringField('test', testName)
            .stringField('status', status)
            .intField('duration', duration);
        await writeApi.writePoint(point);
        await writeApi.close();
}

