import React, { PureComponent } from 'react';
import {
    ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    Legend,
    ResponsiveContainer,
    LabelList
} from 'recharts';

const renderCustomizedLabel = (props) => {
    const {
        x, y, width, height, value
    } = props

    return (
        <g>
            <text x={x + width / 2} y={y + height / 2} fill="#fff" textAnchor="middle" dominantBaseline="middle" >
                {value}
            </text>
        </g>
    );
};

const data = [
    {
        name: 'Gather information', pv: 800,
    },
    {
        name: 'Place orders', pv: 967,
    },
    {
        name: 'Source products', pv: 1397
    },
    {
        name: 'Establish Contacts/Visit', pv: 1480
    },
    {
        name: 'Seek representatives', pv: 800,
    },
    {
        name: 'Evaluate the_show for_future participate', pv: 967,
    },
    {
        name: 'Others', pv: 1480
    }
]

export class VisitorPurpose extends PureComponent {

    render() {
        return (
            <ResponsiveContainer>
                <ComposedChart
                    layout="vertical"
                    data={data}
                    margin={{
                        top: 15, bottom: 20, left: 40
                    }}
                >
                    <CartesianGrid stroke="#f5f5f5" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    {/* <Tooltip /> */}
                    <Bar dataKey="pv" barSize={20} fill="#ee3135" >
                        <LabelList dataKey="pv" content={renderCustomizedLabel} />
                    </Bar>
                </ComposedChart>
            </ResponsiveContainer>
        );
    }
}
