import React, { PureComponent } from 'react';
import { DatePicker, Spin, Select, Cascader, Button } from 'antd';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { getBuyers } from '../../api/buyer';
import { getDepartments } from '../../api/department';
import { getRequesters } from '../../api/requester';
import { getInformation } from '../../api/information';
import { getCompanies } from '../../api/company';
import { getCategories } from '../../api/category';
import { getStatuses } from '../../api/status';
import { measures } from './constants';
import { filterInformation, convertDataForSelect } from './services';
import { Chart } from './Chart';
import './styles.scss';

const Option = Select.Option;
const { RangePicker } = DatePicker;

class CustomChart extends PureComponent {

    state = {
        allInformation: [],
        information: [],
        selectedMeasures: [],
        selectedDimension: [],
        selectedDate: [],
        options: [],
        isLoading: false,
    };

    componentDidMount() {
        this.setState({
            isLoading: true,
        });

        Promise.all([
            getCompanies(),
            getRequesters(),
            getDepartments(),
            getCategories(),
            getStatuses(),
            getBuyers(),
            getInformation(),
        ]).then(([companies, requesters, departments, categories, statuses, buyers, information]) => {

            this.setState({
                options: convertDataForSelect({
                    company: companies,
                    requester: requesters,
                    department: departments,
                    category: categories,
                    status: statuses,
                    buyer: buyers,
                }),
                information,
                allInformation: information,
                isLoading: false,
            });
        });
    }

    onChangeDimension = (value) => {
        const { selectedMeasures,  allInformation } = this.state;
        this.setState({
            selectedDimension: value,
            information: filterInformation(selectedMeasures, value, allInformation),
        });
    }

    onChangeMeasures = (value) => {
        const { selectedDimension,  allInformation } = this.state;
        this.setState({
            selectedMeasures: value,
            information: filterInformation(value, selectedDimension, allInformation),
        });
    }

    onChangeDate = (value) => {

        const [ from, to ] = value;

        this.setState({
            isLoading: true,
            selectedDate: value,
        });
        this.onGetInformation(from, to);
    }

    onClearFilters = () => {
        this.setState({
            selectedMeasures: [],
            selectedDimension: [],
            selectedDate: [],
            isLoading: true,
        });
        this.onGetInformation();
    }

    onGetInformation = (from, to) => {
        getInformation({ from: from && from.format('MM-DD-YYYY'), to: to && to.format('MM-DD-YYYY')}).then(response => {
            const { selectedDimension,  selectedMeasures } = this.state;
            this.setState({
                information: filterInformation(selectedMeasures, selectedDimension, response),
                allInformation: response,
                isLoading: false
            });
        });
    }

    onSaveChart = () => {
        const input = document.getElementById('print-chart');
        html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();
                pdf.addImage(imgData, 'JPEG', 0, 0, 200, 100);
                pdf.save("chart.pdf");
            })
        ;
    }

    renderChart = () => {
        const { isLoading, information, selectedMeasures, selectedDimension } = this.state;
        if (!isLoading && information.length && selectedMeasures.length && selectedDimension.length) {
            const data = information.map(item => Number(item[selectedMeasures])).filter(n =>
                !Number.isNaN(n)).map((y, i) => ({ x: `${i}`, y, }));

            return (<Chart data={data} width={600} height={400} />);
        }
        return (<div className="no-data">No results</div>);
    }

    render() {
        const { options, selectedMeasures, selectedDimension, selectedDate, isLoading, information } = this.state;
        const disableClear = !selectedMeasures.length && !selectedDimension.length && !selectedDate.length;
        const anableSaveChart = !isLoading && information.length && selectedMeasures.length && selectedDimension.length;
        return (
            <Spin size="large" spinning={isLoading}>
                <div className="custom-chart">
                    <div className="top-filters">
                        <div className="top-filters__left">
                            <Cascader
                                className="dimensions"
                                options={options}
                                onChange={this.onChangeDimension}
                                placeholder="Select dimension"
                                value={selectedDimension}
                            />

                            <Select
                                className="measures"
                                placeholder="Select measure"
                                onChange={this.onChangeMeasures}
                                showSearch
                                value={selectedMeasures}
                            >
                                {measures.map(item => <Option key={item.value}>{item.title}</Option>)}
                            </Select>
                        </div>

                        <div className="top-filters__right">
                            <div className="date-select">
                                <RangePicker value={selectedDate} onChange={this.onChangeDate} />
                            </div>
                            <Button
                                className="clear-btn"
                                type="primary"
                                onClick={this.onSaveChart}
                                disabled={!anableSaveChart}
                            >
                                Save
                            </Button>
                            <Button
                                className="clear-btn"
                                type="primary"
                                onClick={this.onClearFilters}
                                disabled={disableClear}
                            >
                                Clear
                            </Button>
                        </div>
                    </div>
                    {!selectedMeasures.length || !selectedDimension.length ?
                        <div className="no-data">
                            Please enter Measure and Dimension
                        </div> : null
                    }

                    {this.renderChart()}
                </div>
            </Spin>
        );
    }
}

export default CustomChart;