import { render } from '@testing-library/react'
import CountrySelect from '../countryselect'
import { useFetchCountries } from '../../api/useFetchoptions'
import { API_ACTIONTYPE } from '@/api'

jest.mock('@/dashboard/api/useFetchoptions', () => ({
  useFetchCountries: jest.fn(),
}))

const mockUseFetchCountries = useFetchCountries as unknown as jest.Mock<typeof useFetchCountries>

describe('CountrySelect', () => {
  it('renders select options when data is loaded successfully', () => {
    const mockCountries = [
      { name: 'us', displayname: 'United States' },
      { name: 'uk', displayname: 'United Kingdom' },
    ]

    mockUseFetchCountries.mockReturnValue(() => ({
      state: { loading: false, data: mockCountries, status: API_ACTIONTYPE.success },
    }))
    const onValueChange = jest.fn()
    const selectedValue = 'us'
    const continentName = 'Europe'

    const result = render(
      <CountrySelect continentName={continentName} selectedValue={selectedValue} onValueChange={onValueChange} />,
    )

    const selectButton = result.getByTestId('place-holder-country')
    expect(selectButton).toBeTruthy()
  })
})
