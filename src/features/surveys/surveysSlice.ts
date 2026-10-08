import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Survey } from '../../types'

interface SurveysState {
  items: Survey[]
}

const initialState: SurveysState = {
  items: [],
}

const surveysSlice = createSlice({
  name: 'surveys',
  initialState,
  reducers: {
    createSurvey(state, action: PayloadAction<Survey>) {
      state.items.push(action.payload)
    },
    updateSurvey(state, action: PayloadAction<Survey>) {
      const i = state.items.findIndex((s) => s.id === action.payload.id)
      if (i !== -1) state.items[i] = action.payload
    },
    deleteSurvey(state, action: PayloadAction<number>) {
      state.items = state.items.filter((s) => s.id !== action.payload)
    },
  },
})

export const { createSurvey, updateSurvey, deleteSurvey } = surveysSlice.actions
export default surveysSlice.reducer
