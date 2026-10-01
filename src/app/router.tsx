import { createBrowserRouter } from 'react-router'
import App from '../App'
import { RequireAuth } from '../features/auth/RequireAuth'
import { LoginPage } from '../pages/LoginPage'
import { MySurveysPage } from '../pages/MySurveysPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { RegisterPage } from '../pages/RegisterPage'
import { SurveyDonePage } from '../pages/SurveyDonePage'
import { SurveyEditorPage } from '../pages/SurveyEditorPage'
import { SurveyFillPage } from '../pages/SurveyFillPage'
import { SurveyPreviewPage } from '../pages/SurveyPreviewPage'
import { SurveyResultsPage } from '../pages/SurveyResultsPage'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/s/:id', element: <SurveyFillPage /> },
  { path: '/s/:id/done', element: <SurveyDonePage /> },
  {
    element: <RequireAuth />,
    children: [
      {
        path: '/',
        element: <App />,
        children: [
          { index: true, element: <MySurveysPage /> },
          { path: 'surveys/:id/edit', element: <SurveyEditorPage /> },
          { path: 'surveys/:id/preview', element: <SurveyPreviewPage /> },
          { path: 'surveys/:id/results', element: <SurveyResultsPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
