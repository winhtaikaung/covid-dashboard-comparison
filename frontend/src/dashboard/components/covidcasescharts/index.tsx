import Chart from '@/components/ui/chart'
import { useMemo } from 'react'
import useFetchCovidData from './useFetchCovidData'

const CovidCasesCharts: React.FC<{ countryName: string }> = ({ countryName }) => {
    const {
        newReportedCase,
        newReportedDeathCase,
        loadingIndicator,
        hospitalizedVsICUPatients,
        noDataAvailable,
        totalVaccinationPercentage,
    } = useFetchCovidData({ countryName })
    const newReportedCaseLineChart = useMemo(() => {
        return (
            <div
                className="p-4 bg-white rounded-lg shadow-md h-[450px] flex items-center justify-center"
                data-testid="newReportedCaseChart"
                aria-label="Newly Reported Case"
            >
                {loadingIndicator(newReportedCase.state.loading)}
                {noDataAvailable(!newReportedCase.state.loading && newReportedCase.state.data?.length === 0)}
                {!newReportedCase.state.loading && newReportedCase.state.data?.length > 0 && (
                    <Chart
                        options={{
                            title: {
                                text: 'Newly Reported Case',
                            },
                            xAxis: {
                                type: 'datetime',
                                crosshair: true,
                                dateTimeLabelFormats: {
                                    year: '%b %e, %Y',
                                },
                                title: {
                                    text: 'Date',
                                },
                            },
                            series: [
                                {
                                    type: 'area',
                                    color: 'orange',
                                    name: 'New Reported Case throughout the Year',
                                    data: newReportedCase?.state?.data?.map(({ date, new_cases }: { date: Date; new_cases: number }) => [
                                        new Date(date).getTime() / 1000,
                                        new_cases,
                                    ]),
                                },
                            ],
                        }}
                    />
                )}
            </div>
        )
    }, [newReportedCase.state, loadingIndicator, noDataAvailable])

    const newReportDeathCaseLineChart = useMemo(() => {
        return (
            <div
                className="p-4 bg-white rounded-lg shadow-md h-[450px] flex items-center justify-center"
                data-testid="newReportedDeathCaseChart"
                aria-label="Newly Reported Death Case"
            >
                {loadingIndicator(newReportedDeathCase.state.loading)}
                {noDataAvailable(!newReportedDeathCase.state.loading && newReportedDeathCase.state.data?.length === 0)}
                {!newReportedDeathCase.state.loading && newReportedDeathCase.state.data?.length > 0 && (
                    <Chart
                        options={{
                            title: {
                                text: 'New Death Case',
                                margin: 10,
                            },
                            xAxis: {
                                type: 'datetime',
                                crosshair: true,
                                dateTimeLabelFormats: {
                                    year: '%b %e, %Y',
                                }, // label in x axis will be displayed like Jan 1, 2012

                                title: {
                                    text: 'Date',
                                },
                            },
                            series: [
                                {
                                    type: 'spline',
                                    color: 'red',
                                    name: 'New Death Case throughout the Year',
                                    data: newReportedDeathCase?.state?.data?.map(
                                        ({ date, new_deaths }: { date: Date; new_deaths: number }) => [
                                            new Date(date).getTime() / 1000,
                                            new_deaths,
                                        ],
                                    ),
                                },
                            ],
                        }}
                    />
                )}
            </div>
        )
    }, [loadingIndicator, newReportedDeathCase.state.data, newReportedDeathCase.state.loading, noDataAvailable])

    const hospitalizedVsICUUseCaseLineChart = useMemo(() => {
        return (
            <div
                className="p-4 bg-white rounded-lg shadow-md h-[450px] flex items-center justify-center"
                data-testid="hospitalizedvsIcuChart"
                aria-label="Hospitalized vs ICU Case"
            >
                {loadingIndicator(hospitalizedVsICUPatients.state.loading)}
                {noDataAvailable(
                    !hospitalizedVsICUPatients.state.loading && hospitalizedVsICUPatients.state.data?.length === 0,
                )}

                {!hospitalizedVsICUPatients.state.loading && hospitalizedVsICUPatients.state.data?.length > 0 && (
                    <Chart
                        options={{
                            title: {
                                text: 'Weekly ICU Vs Hospitalized Patients',
                                margin: 10,
                            },
                            xAxis: {
                                type: 'datetime',
                                crosshair: true,
                                dateTimeLabelFormats: {
                                    year: '%b %e, %Y',
                                },
                                title: {
                                    text: 'Date',
                                },
                            },
                            series: [
                                {
                                    type: 'spline',
                                    color: 'red',
                                    name: 'Weekly ICU Hospitalized Patients',
                                    data: hospitalizedVsICUPatients?.state?.data?.map(
                                        ({ date, total_icu_patients }: { date: Date; total_icu_patients: number }) => [
                                            new Date(date).getTime() / 1000,
                                            +total_icu_patients,
                                        ],
                                    ),
                                },
                                {
                                    type: 'spline',
                                    color: 'blue',
                                    name: 'Weekly Hospitalized Patients',
                                    data: hospitalizedVsICUPatients?.state?.data?.map(
                                        ({ date, total_hosp_patients }: { date: Date; total_hosp_patients: number }) => [
                                            new Date(date).getTime() / 1000,
                                            +total_hosp_patients,
                                        ],
                                    ),
                                },
                            ],
                        }}
                    />
                )}
            </div>
        )
    }, [hospitalizedVsICUPatients.state.data, hospitalizedVsICUPatients.state.loading, loadingIndicator, noDataAvailable])

    const vaccinationPerPopulationPieChart = useMemo(() => {
        return (
            <div
                className="p-4 bg-white rounded-lg shadow-md h-[450px] flex items-center justify-center"
                data-testid="vaccinationCoverageChart"
                aria-label="Vaccination Coverage Per population Chart"
            >
                {loadingIndicator(totalVaccinationPercentage.state.loading)}
                {noDataAvailable(
                    !totalVaccinationPercentage.state.loading && totalVaccinationPercentage.state.data?.length === 0,
                )}

                {!totalVaccinationPercentage.state.loading && totalVaccinationPercentage.state.data?.length > 0 && (
                    <Chart
                        options={{
                            chart: {
                                type: 'pie',
                            },
                            title: {
                                text: 'Total Vaccination Coverage',
                            },
                            tooltip: {
                                valueSuffix: '%',
                            },
                            subtitle: {
                                text: 'Source:<a href="https://github.com/owid/covid-19-data" target="_default">CovidData</a>',
                            },
                            plotOptions: {
                                series: {
                                    allowPointSelect: true,
                                    cursor: 'pointer',
                                    dataLabels: [
                                        {
                                            enabled: true,
                                            // @ts-expect-error The distance is mandatory to build the pie slices
                                            distance: 20,
                                        },
                                        {
                                            enabled: true,
                                            // @ts-expect-error The distance is mandatory to build the pie slices
                                            distance: -40,
                                            format: '{point.percentage:.1f}%',
                                            style: {
                                                fontSize: '1.2em',
                                                textOutline: 'none',
                                                opacity: 0.7,
                                            },
                                            filter: {
                                                operator: '>',
                                                property: 'percentage',
                                                value: 10,
                                            },
                                        },
                                    ],
                                },
                            },
                            series: [
                                // @ts-expect-error The ighchart series object for pie chart does not support the typescript
                                {
                                    name: 'Percentage',
                                    colorByPoint: true,
                                    data: [
                                        {
                                            name: 'VaccinationPercentage',
                                            y: +totalVaccinationPercentage.state.data?.at(0).percent_fully_vaccinated,
                                            color: 'green',
                                        },
                                        {
                                            name: 'Non VaccinatedPercentage',
                                            sliced: true,
                                            y: 100 - +totalVaccinationPercentage.state.data?.at(0).percent_fully_vaccinated,
                                        },
                                    ],
                                },
                            ],
                        }}
                    />
                )}
            </div>
        )
    }, [
        loadingIndicator,
        noDataAvailable,
        totalVaccinationPercentage.state.data,
        totalVaccinationPercentage.state.loading,
    ])
    return (
        <>
            {newReportedCaseLineChart}
            {newReportDeathCaseLineChart}
            {hospitalizedVsICUUseCaseLineChart}
            {vaccinationPerPopulationPieChart}
        </>
    )
}

export default CovidCasesCharts
