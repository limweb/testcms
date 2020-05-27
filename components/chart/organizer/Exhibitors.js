import React, { Component, PureComponent } from 'react'
import { Pie, PieChart, Sector, ResponsiveContainer } from 'recharts'
import { formatIntegerNumber } from '../../../util/utilities';


const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
        cx, cy,
        midAngle,
        innerRadius, outerRadius,
        startAngle, endAngle,
        fill,
        payload,
        percent,
        value
    } = props;
    return (
        <g>
            <text x={cx} y={cy} dy={0} textAnchor="middle" fill={'gray'}>{formatIntegerNumber(payload.sum)}</text>
            <text x={cx} y={cy} dy={18} textAnchor="middle" fill={'gray'}>{payload.center}</text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={payload.color}
            />
        </g>
    );
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index, x, y
}) => {
    const radius = innerRadius + ((outerRadius - innerRadius) * 0.5);
    const xx = cx + radius * Math.cos(-midAngle * RADIAN);
    // const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="#999" textAnchor={'center'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    )
}

class Exhibitors extends Component {

    constructor(props) {
        super(props)
        this.state = {
            activeIndex: 0
        }
    }

    onPieEnter = (data, index) => {
        this.setState({
            activeIndex: index,
        });
    }

    render() {
        const { total, oversea, local } = this.props
        const data = [
            { center: 'Visitors', value: oversea, sum: total, color: '#ee3135', name: 'Oversea' },
            { center: 'Visitors', value: local, sum: total, color: '#999', name: 'Local' },
        ]
        return (
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        activeIndex={0}
                        activeShape={renderActiveShape}
                        data={data}
                        dataKey="value"
                        outerRadius={'90%'}
                        innerRadius={'70%'}
                        labelLine={false}
                        label={renderCustomizedLabel}
                    />
                </PieChart>
            </ResponsiveContainer>
        );
    }
}

export { Exhibitors } 
