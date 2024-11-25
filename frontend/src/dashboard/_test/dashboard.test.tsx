import { render } from '@testing-library/react'
import Layout from '@/dashboard/index'

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

describe('Layout Component', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders without crashing', () => {
    const { getByText, getByTestId } = render(<Layout />)

    const headingElement = getByText('Covid 19 Data Statics Comparison By Country')
    const comparisonButton = getByTestId('comparisoninput')

    const baseinputButton = getByTestId('baseinput')

    expect(comparisonButton).toBeTruthy()

    expect(baseinputButton).toBeTruthy()
    expect(headingElement).toBeTruthy()
  })
})
