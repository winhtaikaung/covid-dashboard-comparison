import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Option } from '@/types/types'
import { useFetchCountries } from '../api/useFetchoptions'
import { API_ACTIONTYPE } from '@/api'

const CountrySelect: React.FC<{
  continentName: string
  selectedValue: string
  onValueChange: (value: string) => void
}> = ({ onValueChange, selectedValue, continentName }) => {
  const { state } = useFetchCountries(continentName)

  return (
    <Select value={selectedValue} onValueChange={onValueChange}>
      <SelectTrigger className="w-auto">
        <SelectValue data-testid="place-holder-country" placeholder="Select Country" />
      </SelectTrigger>

      {!state?.loading && state?.data && state?.status === API_ACTIONTYPE.success && (
        <SelectContent>
          {state.data.map((c: Option) => (
            <SelectItem key={c.name.toLowerCase().replace(' ', '-')} value={c.name}>
              {c.displayname}
            </SelectItem>
          ))}
        </SelectContent>
      )}
    </Select>
  )
}

export default CountrySelect
