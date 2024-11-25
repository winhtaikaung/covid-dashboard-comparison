import { Skeleton } from '@/components/ui/skeleton'
import { useFetchUCByCountry } from '@/dashboard/api/useFetchoptions'
import { ChartUseCasesType } from '@/dashboard/enums/usecase'

function useFetchCovidData({ countryName }: { countryName: string }) {
  const newReportedCase = useFetchUCByCountry(countryName, ChartUseCasesType.USE_CASE_NEW_REPORTED_CASE)
  const newReportedDeathCase = useFetchUCByCountry(countryName, ChartUseCasesType.USE_CASE_DEATH_RATE)
  const hospitalizedVsICUPatients = useFetchUCByCountry(countryName, ChartUseCasesType.USE_CASE_ICU_VS_HOSP)
  const totalVaccinationPercentage = useFetchUCByCountry(countryName, ChartUseCasesType.USE_CASE_VACCINATION_PERCENTAGE)

  const loadingIndicator = (dep: boolean) => (
    <>
      {dep && (
        <>
          <div>
            <Skeleton data-testid="loading" className="h-4 w-[300px] mb-3" />
            <Skeleton className="h-4 w-[300px] mb-3" />
            <Skeleton className="h-4 w-[300px] mb-3" />
            <Skeleton className="h-4 w-[300px] mb-3" />
            <Skeleton className="h-4 w-[300px] mb-3" />
          </div>
        </>
      )}
    </>
  )

  const noDataAvailable = (dep: boolean) => (
    <>
      {dep && (
        <p data-testid="no-data" className="text-lg">
          No Data Available
        </p>
      )}
    </>
  )

  return {
    newReportedCase,
    newReportedDeathCase,
    hospitalizedVsICUPatients,
    totalVaccinationPercentage,
    loadingIndicator,
    noDataAvailable,
  }
}

export default useFetchCovidData
