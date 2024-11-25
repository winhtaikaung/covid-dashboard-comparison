import React, { useRef } from 'react'
import * as Highcharts from 'highcharts'
import { HighchartsReact } from 'highcharts-react-official'

const Chart: React.FC<HighchartsReact.Props> = (props: HighchartsReact.Props) => {
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null)
  return <HighchartsReact highcharts={Highcharts} options={props.options} ref={chartComponentRef} {...props} />
}

export default Chart
