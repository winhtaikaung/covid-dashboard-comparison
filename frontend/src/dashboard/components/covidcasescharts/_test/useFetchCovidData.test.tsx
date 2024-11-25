import { renderHook } from '@testing-library/react'
import useFetchCovidData from '@/dashboard/components/covidcasescharts/useFetchCovidData'

jest.mock('@/dashboard/api/useFetchoptions', () => ({ useFetchUCByCountry: jest.fn() }))

describe('useFetchCovidData', () => {
  it('load useFetchCovidData for a specific country', () => {
    const mockCountryName = 'TestCountry'

    const { result } = renderHook(() => useFetchCovidData({ countryName: mockCountryName }))
    expect(result.current.newReportedCase).toBeFalsy()
    expect(result.current.newReportedDeathCase).toBeFalsy()
    expect(result.current.hospitalizedVsICUPatients).toBeFalsy()
    expect(result.current.totalVaccinationPercentage).toBeFalsy()
  })
})
