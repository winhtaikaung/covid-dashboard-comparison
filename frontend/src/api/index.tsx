import * as React from 'react'
export const enum API_ACTIONTYPE {
  loading = 'loading',
  success = 'success',
  error = 'error',
}

type ApiReducerType = {
  loading: boolean
  status: API_ACTIONTYPE
  data?: any
  error?: string
}

type ApiActionType = {
  actionType: API_ACTIONTYPE
  data?: any
  error?: Error
}

export type SideEffectType = {
  onSuccess?: (data?: { [key: string]: any }) => void
  onError?: (msg?: string) => void
  onLoading?: () => void
}

const API: (
  url: string,
  abortSignal: AbortSignal,
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE',
  data?: { [key: string]: any },
) => Promise<{ [key: string]: any }> = async (
  url: string,
  abortSignal: AbortSignal,
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE',
  data?: { [key: string]: any },
) => {
  try {
    const response = await fetch(
      `${(window as { [key: string]: any })['__API_URL__'] || 'http://localhost:5000'}${url}`,
      {
        method: method || 'GET',
        mode: 'cors',
        signal: abortSignal,
        headers: {
          'Content-Type': 'application/json',
        },
        body: method === 'GET' ? undefined : JSON.stringify(data || {}),
      },
    )
    return response.json()
  } catch (e) {
    throw Error(e?.message)
  }
}

export const useApiReducer = (
  url: string,
  fetchOnLoad?: boolean,
  sideEffect?: SideEffectType,
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE',
  payload?: { [key: string]: any },
) => {
  const initialState = { loading: false, data: null, error: undefined, status: API_ACTIONTYPE.loading }

  const reducer = (state: ApiReducerType = initialState, action: ApiActionType): ApiReducerType => {
    switch (action.actionType) {
      case 'loading':
        return { ...state, loading: true, data: null, error: undefined, status: action.actionType }
      case 'success':
        return { ...state, loading: false, data: action.data, error: undefined, status: action.actionType }
      case 'error':
        return { ...state, loading: false, data: null, error: action.error?.message, status: action.actionType }
      default:
        return initialState
    }
  }

  const [state, dispatch] = React.useReducer(reducer, initialState)

  const makeAPICallBack = React.useCallback(
    (bodyPayload: any) => {
      const controller = new AbortController()
      const signal = controller.signal

      const fetchData = async () => {
        sideEffect?.onLoading?.()
        try {
          dispatch({ actionType: API_ACTIONTYPE.loading })
          const data = await API(url, signal, method, bodyPayload)
          sideEffect?.onSuccess?.(data.data)
          dispatch({ actionType: API_ACTIONTYPE.success, data: data.data })
        } catch (e: any) {
          sideEffect?.onError?.(e)
          dispatch({ actionType: API_ACTIONTYPE.error, error: e })
        }
      }
      fetchData()

      return () => {
        controller.abort()
      }
    },
    [method, sideEffect, url],
  )

  React.useEffect(() => {
    const controller = new AbortController()
    const signal = controller.signal

    let mounted = true

    const fetchData = async () => {
      sideEffect?.onLoading?.()
      dispatch({ actionType: API_ACTIONTYPE.loading })
      try {
        const data = await API(url, signal, method)
        sideEffect?.onSuccess?.(data?.data)
        dispatch({ actionType: API_ACTIONTYPE.success, data: data?.data })
      } catch (e: any) {
        sideEffect?.onError?.(e)
        dispatch({ actionType: API_ACTIONTYPE.error, error: e })
      }
    }

    if (!!fetchOnLoad && mounted) {
      fetchData()
    }

    return () => {
      mounted = false
      controller.abort()
    }
  }, [url, fetchOnLoad, method, payload, sideEffect])

  return { state, makeAPICall: makeAPICallBack }
}
