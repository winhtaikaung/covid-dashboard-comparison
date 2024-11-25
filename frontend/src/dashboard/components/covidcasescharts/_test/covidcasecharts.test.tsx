import { render } from '@testing-library/react'
import CovidCasesCharts from '..'

jest.mock('@/dashboard/api/useFetchoptions', () => ({
  useFetchContinents: jest.fn(() => ({
    state: { data: [{ name: 'asia', displayname: 'Asia' }], loading: false, error: null, status: 'success' },
  })),
  useFetchCountries: jest.fn(() => ({
    state: { data: [{ name: 'singapore', displayname: 'Singapore' }], loading: false, error: null, status: 'success' },
  })),
  useFetchUCByCountry: jest.fn(() => ({
    state: {
      data: [
        {
          date: '2020-01-26T00:00:00.000Z',
          new_cases: 1,
        },
      ],
      loading: false,
      error: null,
      status: 'success',
    },
  })),
}))

describe('CovidCharts Component', () => {
  it('renders without crashing', () => {
    const { getByTestId } = render(<CovidCasesCharts countryName="canada" />)

    const noDataComponent = getByTestId('newReportedCaseChart')

    const newReportedDeathCase = getByTestId('newReportedDeathCaseChart')

    const hospitalizedvsIcuChart = getByTestId('hospitalizedvsIcuChart')

    const vaccinationCoverageChart = getByTestId('vaccinationCoverageChart')

    // const baseinputButton = getByTestId("baseinput")
    expect(noDataComponent).toBeTruthy()
    expect(hospitalizedvsIcuChart).toBeTruthy()
    expect(newReportedDeathCase).toBeTruthy()

    expect(vaccinationCoverageChart).toBeTruthy()
  })
})
