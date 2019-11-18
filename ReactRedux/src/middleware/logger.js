const logger = store => next => action => {
    console.group(action.type)
    console.log(`dispatching:${action}`)

    const result = next(action)
    
    const nextState = store.getState()
    console.log(`next state: ${nextState}`)
    
    console.groupEnd(action.type)
    return result
}

export default logger
