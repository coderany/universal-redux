import createRouterHistory from './createRouterHistory'
import createBrowserHistory from '../../node_modules/history/lib/createBrowserHistory'

export default createRouterHistory(createBrowserHistory)
