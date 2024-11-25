import React, { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Option } from '@/types/types'
import { useFetchContinents } from './api/useFetchoptions'
import { API_ACTIONTYPE } from '@/api'
import CountrySelect from './components/countryselect'
import CovidCasesCharts from './components/covidcasescharts'

const Layout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'column1' | 'column2'>('column1')
  const [continent1, setContinent1] = useState<string>('')
  const [country1, setCountry1] = useState<string>('')
  const [continent2, setContinent2] = useState<string>('')
  const [country2, setCountry2] = useState<string>('')

  const { state } = useFetchContinents()

  const handleContinentChange = (value: string, column: 1 | 2): void => {
    if (column === 1) {
      setContinent1(value)
      setCountry1('')
    } else {
      setContinent2(value)
      setCountry2('')
    }
  }

  const handleCountryChange = (value: string, column: 1 | 2): void => {
    if (column === 1) {
      setCountry1(value)
    } else {
      setCountry2(value)
    }
  }

  const renderColumn = (columnNumber: 1 | 2): JSX.Element => (
    <div className="flex flex-col space-y-4">
      <Select
        value={columnNumber === 1 ? continent1 : continent2}
        onValueChange={(value: string) => {
          handleContinentChange(value, columnNumber)
        }}
      >
        <>
          <SelectTrigger className="w-auto">
            <SelectValue placeholder="Select Continent" />
          </SelectTrigger>
          {!state.loading && state.data && state.status === API_ACTIONTYPE.success && (
            <SelectContent>
              {state.data.map((c: Option) => (
                <SelectItem key={c.name.toLowerCase().replace(' ', '-')} value={c.name}>
                  {c.displayname}
                </SelectItem>
              ))}
            </SelectContent>
          )}
        </>
      </Select>
      <CountrySelect
        continentName={columnNumber === 1 ? continent1 : continent2}
        onValueChange={(e) => {
          handleCountryChange(e, columnNumber)
        }}
        selectedValue={columnNumber === 1 ? country1 : country2}
      />

      <CovidCasesCharts countryName={columnNumber === 1 ? country1 : country2} />
    </div>
  )

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold leading-none tracking-tight text-gray-900 md:text-2xl lg:text-3xl dark:text-white">
        Covid 19 Data Statics Comparison By Country
      </h1>
      <div className="md:hidden">
        <div className="flex mb-4">
          <button
            data-testid="baseinput"
            className={`flex-1 py-2 ${activeTab === 'column1' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('column1')}
            aria-label="Base Input"
          >
            Base Input
          </button>
          <button
            data-testid="comparisoninput"
            className={`flex-1 py-2 ${activeTab === 'column2' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => setActiveTab('column2')}
            aria-label="Comparison Input"
          >
            Comparison Input
          </button>
        </div>
        <div className="mt-4">{activeTab === 'column1' ? renderColumn(1) : renderColumn(2)}</div>
      </div>
      <div className="hidden md:flex md:space-x-4">
        <div className="w-1/2">{renderColumn(1)}</div>
        <div className="w-1/2">{renderColumn(2)}</div>
      </div>
    </div>
  )
}

export default Layout
