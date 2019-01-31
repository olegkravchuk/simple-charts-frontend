import React, { PureComponent } from 'react';
import { XYPlot, VerticalBarSeries } from 'react-vis';
import { formatNumber } from './utils';
import './styles.scss';


class Charts extends PureComponent {

    renderRequestsChart = (data) => {
        const requestNumbers = data.map(item => Number(item.request_number)).filter(n => !Number.isNaN(n));

        return {
            totalRequests: requestNumbers.reduce((a, b) => a + b, 0),
            chart: requestNumbers.length ?
                <XYPlot xType="ordinal" width={400} height={300}>
                     <VerticalBarSeries
                         animation
                         data={requestNumbers.map((n, i) => ({ x: `${i}`, y: n }))}
                    />
                </XYPlot> :
                <div className="no-data-chart">No Data</div>
        }
    }

    renderSpendPurchaseChart = (data) => {
        const spendPurchase = data.map(item => ({
            total_quote_price: Number(item.total_quote_price),
            quote_selected: item.quote_selected,
        })).filter(n => !Number.isNaN(n.total_quote_price) && n.quote_selected);

        return {
            totalQuotePrice: Math.round(spendPurchase.reduce((a, b) => a + b.total_quote_price, 0)),
            chart: spendPurchase.length ?
                <XYPlot xType="ordinal" width={400} height={300}>
                     <VerticalBarSeries
                         animation
                         data={spendPurchase.map((n, i) => ({ x: `${i}`, y: n.total_quote_price }))}
                    />
                </XYPlot>:
                <div className="no-data-chart">No Data</div>
        }
    }

    renderProvideQuoteChart = (data) => {
        const provideQuote = data.map(item => ({
            request_number: Number(item.request_number),
            quote_selected: item.quote_selected,
            request_to_quote_cycle_time: item.request_to_quote_cycle_time ?
                item.request_to_quote_cycle_time === 'less than a day' ? 0.5 :
                    Number(item.request_to_quote_cycle_time.slice(0, -1)) : 0,
        })).filter(n => !Number.isNaN(n.request_number) && n.quote_selected);

        return {
            averageOfRequest: Math.round(provideQuote.reduce((a, b) => a + b.request_to_quote_cycle_time, 0) / provideQuote.length),
            chart: provideQuote.length ?
                <XYPlot xType="ordinal" width={400} height={300}>
                     <VerticalBarSeries
                         animation
                         data={provideQuote.map((n, i) => ({ x: `${i}`, y: n.request_number }))}
                    />
                </XYPlot> :
                <div className="no-data-chart">No Data</div>
        }
    }

    renderClosedRequestsChart = (data) => {
        const closedRequests = data.map(item => ({
            request_number: Number(item.request_number),
            status: item.status,
        })).filter(n => !Number.isNaN(n.request_number) && n.status === 5);

        return {
            totalRequests: closedRequests.reduce((a, b) => a + b.request_number, 0),
            chart: closedRequests.length ?
                <XYPlot xType="ordinal" width={400} height={300}>
                     <VerticalBarSeries
                         animation
                         data={closedRequests.map((n, i) => ({ x: `${i}`, y: n.request_number }))}
                    />
                </XYPlot> :
                <div className="no-data-chart">No Data</div>
        }
    }

    renderSavingsAchievedChart = (data) => {
        const savingsAchieved = data.map(item => ({
            savings_amount: Number(item.savings_amount),
            status: item.status,
        })).filter(n => !Number.isNaN(n.savings_amount) && n.status === 5);

        return {
            totalSavingsAmount: Math.round(savingsAchieved.reduce((a, b) => a + b.savings_amount, 0)),
            chart: savingsAchieved.length ?
                <XYPlot xType="ordinal" width={400} height={300}>
                     <VerticalBarSeries
                         animation
                         data={savingsAchieved.map((n, i) => ({ x: `${i}`, y: n.savings_amount }))}
                    />
                </XYPlot> :
                <div className="no-data-chart">No Data</div>
        }
    }

    renderRespondForQuotesChart = (data) => {
        const savingsAchieved = data.map(item => ({
            request_number: Number(item.request_number),
            status: item.status,
            supplier_response_cycle_time: item.supplier_response_cycle_time ?
                item.supplier_response_cycle_time === 'less than a day' ? 0.5 :
                    Number(item.supplier_response_cycle_time.slice(0, -1)) : 0,
        })).filter(n => !Number.isNaN(n.request_number) && n.status === 5);

        return {
            averageOfResponse: Math.round(savingsAchieved.reduce((a, b) => a + b.supplier_response_cycle_time, 0) / savingsAchieved.length),
            chart: savingsAchieved.length ?
                <XYPlot xType="ordinal" width={400} height={300}>
                     <VerticalBarSeries
                         animation
                         data={savingsAchieved.map((n, i) => ({ x: `${i}`, y: n.request_number }))}
                    />
                </XYPlot> :
                <div className="no-data-chart">No Data</div>
        }
    }

    render() {
        const { data } = this.props;
        const requestChart = this.renderRequestsChart(data);
        const spendPurchaseChart = this.renderSpendPurchaseChart(data);
        const provideQuoteChart = this.renderProvideQuoteChart(data);
        const closedRequestsChart = this.renderClosedRequestsChart(data);
        const savingsAchievedChart = this.renderSavingsAchievedChart(data);
        const respondForQuotesChart = this.renderRespondForQuotesChart(data);

        return (
            <div className="charts-block">
                <div className="charts-block__item">
                    {requestChart.chart}
                    <div className="charts-block__item_desc">
                        {`${formatNumber(requestChart.totalRequests)} Requests`}
                    </div>
                </div>
                <div className="charts-block__item">
                    {spendPurchaseChart.chart}
                    <div className="charts-block__item_desc">
                        {`$${formatNumber(spendPurchaseChart.totalQuotePrice)} in spend (only on 'Closed Accepted' requests)`}
                    </div>
                </div>
                <div className="charts-block__item">
                    {provideQuoteChart.chart}
                    <div className="charts-block__item_desc">
                        {`Avg. ${provideQuoteChart.averageOfRequest} days - Request 2 Quote cycle time (only on quoted requests)`}
                    </div>
                </div>
                <div className="charts-block__item">
                    {closedRequestsChart.chart}
                    <div className="charts-block__item_desc">
                        {`${formatNumber(closedRequestsChart.totalRequests)} Closed requests`}
                    </div>
                </div>
                <div className="charts-block__item">
                    {savingsAchievedChart.chart}
                    <div className="charts-block__item_desc">
                        {`$${formatNumber(savingsAchievedChart.totalSavingsAmount)} in savings (only on 'Closed Accepted' requests)`}
                    </div>
                </div>
                <div className="charts-block__item">
                    {respondForQuotesChart.chart}
                    <div className="charts-block__item_desc">
                        {`Avg. ${respondForQuotesChart.averageOfResponse} days - Supplier response Cycle time (only on quoted requests)`}
                    </div>
                </div>


            </div>
        );
    }
}

export default Charts;