import React, { useRef, useState, useEffect } from 'react';
import * as R from 'ramda';

export default (initState, actionsMap) => {
  const state = useRef(initState);

  const toAction = action => (...params) => {
    const updateState = action(...params);
    state.current = updateState(state.current);
  };

  const actions = R.map(toAction, actionsMap);

  return [state, actions];
};
