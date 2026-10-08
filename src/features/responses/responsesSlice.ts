import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { SurveyResponse } from '../../types'

interface ResponsesState {
  items: SurveyResponse[]
}

const initialState: ResponsesState = {
  items: [],
}

const responsesSlice = createSlice({
  name: 'responses',
  initialState,
  reducers: {
    addResponse(state, action: PayloadAction<SurveyResponse>) {
      state.items.push(action.payload)
    },
  },
})

export const { addResponse } = responsesSlice.actions
export default responsesSlice.reducer
