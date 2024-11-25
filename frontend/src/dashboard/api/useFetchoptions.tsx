import { SideEffectType, useApiReducer } from '@/api'
import { ChartUseCasesType } from '../enums/usecase'

export const useFetchContinents = (sideEffects?: SideEffectType) => {
  const api = useApiReducer(`/options/continent`, true, sideEffects, 'GET')

  return { state: api.state }
}

export const useFetchCountries = (continent: string, sideEffects?: SideEffectType) => {
  const api = useApiReducer(`/options/country?continent=${continent}`, true, sideEffects, 'GET')

  return { state: api.state }
}

export const useFetchUCByCountry = (country: string, useCase: ChartUseCasesType, sideEffects?: SideEffectType) => {
  const api = useApiReducer(`/countrydata/${useCase}?country=${country}`, true, sideEffects, 'GET')

  return { state: api.state }
}
