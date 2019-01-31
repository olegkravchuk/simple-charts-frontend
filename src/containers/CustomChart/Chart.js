import React from 'react';
import { XYPlot, VerticalBarSeries } from 'react-vis';

export const Chart = ({ data, width, height }) => (
    <div className="charts">
        <div className="charts__title">Custom Chart</div>
        <div className="charts__items" id="print-chart">
            {data.length ?
                <XYPlot xType="ordinal" width={width} height={height}>
                    <VerticalBarSeries
                        animation
                        data={data}
                    />
                </XYPlot> :
                <div className="no-data-chart">No Data</div>
            }
        </div>
    </div>
);