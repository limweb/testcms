import React, { PureComponent } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { differenceInDays, addDays } from 'date-fns'
import moment from 'moment';
import { formatIntegerNumber } from '../../../util/utilities';

function getAllDate(data = []) {
    if (data.length > 1) {
        const firstDay = moment(data[0].date, 'DD-MM-YYYY').toDate()
        const lastDay = moment(data[data.length - 1].date, 'DD-MM-YYYY').toDate()
        const diff = differenceInDays(lastDay, firstDay)
        const dateArray = []
        dateArray.push(moment(firstDay).format('DD-MM-YYYY'))
        for (let i = 1; i <= diff; i++) {
            dateArray.push(
                moment(addDays(firstDay, i)).format('DD-MM-YYYY')
            )
        }
        return dateArray
    }
    return []
}

class CustomizedLabel extends PureComponent {
    render() {
        const {
            x, y, stroke, value,
        } = this.props;

        return <text x={x} y={y} dy={-4} fill={stroke} fontSize={10} textAnchor="middle">{formatIntegerNumber(value)}</text>;
    }
}

export class VisitorVisitBooth extends PureComponent {

    render() {

        const { data } = this.props
        const allDates = getAllDate(data)
        const formattedData = allDates.map(a => {
            const found = data.find(d => d.date === a)
            if (found) {
                return {
                    name: moment(found.date, 'DD-MM-YYYY').format('DD/MM/YYYY'),
                    ['Not Unique']: found.notUnique,
                    ['Unique']: found.unique
                }
            } else {
                return {
                    name: moment(a, 'DD-MM-YYYY').format('DD/MM/YYYY'),
                    ['Not Unique']: 0,
                    ['Unique']: 0
                }
            }
        })

        return (
            <ResponsiveContainer>
                <LineChart
                    data={formattedData}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey={'Not Unique'} stroke="#999" activeDot={{ r: 8 }} label={<CustomizedLabel />} />
                    <Line type="monotone" dataKey="Unique" stroke="#ee3135" label={<CustomizedLabel />} />
                </LineChart>
            </ResponsiveContainer>

        );
    }
}
