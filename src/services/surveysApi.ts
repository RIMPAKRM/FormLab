import type { Survey, SurveyResponse } from '../types'
import { api } from './api'

export const surveysApi = api.injectEndpoints({
  endpoints: (build) => ({
    getMySurveys: build.query<Survey[], number>({
      query: (userId) => `surveys?userId=${userId}`,
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Survey' as const, id })), 'Survey']
          : ['Survey'],
    }),
    getSurvey: build.query<Survey, number>({
      query: (id) => `surveys/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Survey', id }],
    }),
    createSurvey: build.mutation<Survey, Omit<Survey, 'id' | 'createdAt' | 'updatedAt'>>({
      query: (body) => ({ url: 'surveys', method: 'POST', body }),
      invalidatesTags: ['Survey'],
    }),
    updateSurvey: build.mutation<Survey, Partial<Survey> & Pick<Survey, 'id'>>({
      query: ({ id, ...patch }) => ({ url: `surveys/${id}`, method: 'PATCH', body: patch }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Survey', id }],
    }),
    deleteSurvey: build.mutation<void, number>({
      query: (id) => ({ url: `surveys/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Survey'],
    }),
    getResponses: build.query<SurveyResponse[], number>({
      query: (surveyId) => `responses?surveyId=${surveyId}`,
      providesTags: (_result, _error, surveyId) => [{ type: 'Response', id: surveyId }],
    }),
    submitResponse: build.mutation<SurveyResponse, Omit<SurveyResponse, 'id'>>({
      query: (body) => ({ url: 'responses', method: 'POST', body }),
      invalidatesTags: (_result, _error, { surveyId }) => [{ type: 'Response', id: surveyId }],
    }),
  }),
})

export const {
  useGetMySurveysQuery,
  useGetSurveyQuery,
  useCreateSurveyMutation,
  useUpdateSurveyMutation,
  useDeleteSurveyMutation,
  useGetResponsesQuery,
  useSubmitResponseMutation,
} = surveysApi
