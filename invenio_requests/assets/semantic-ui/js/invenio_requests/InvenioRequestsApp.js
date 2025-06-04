// This file is part of InvenioRequests
// Copyright (C) 2022 CERN.
// Copyright (C) 2024 KTH Royal Institute of Technology.
//
// Invenio RDM Records is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import {
  InvenioRequestsAPI,
  RequestLinksExtractor,
  InvenioRequestEventsApi,
  RequestEventsLinksExtractor,
} from "./api";
import { Request } from "./request";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { configureStore } from "./store";
import { OverridableContext } from "react-overridable";
import { Provider } from "react-redux";

export class InvenioRequestsApp extends Component {
  constructor(props) {
    super(props);
    const {
      request,
      requestsApi,
      requestEventsApi,
      defaultQueryParams,
      commentContentMaxLength,
    } = this.props;
    const defaultRequestsApi = new InvenioRequestsAPI(
      new RequestLinksExtractor(request)
    );
    const defaultRequestEventsApi = (commentLinks) =>
      new InvenioRequestEventsApi(new RequestEventsLinksExtractor(commentLinks));
    const appConfig = {
      requestsApi: requestsApi || defaultRequestsApi,
      request,
      requestEventsApi: requestEventsApi || defaultRequestEventsApi,
      refreshIntervalMs: 5000,
      defaultQueryParams,
      commentContentMaxLength,
    };
    this.store = configureStore(appConfig);
  }

  render() {
    const { overriddenCmps, userAvatar, permissions } = this.props;

    return (
      <OverridableContext.Provider value={overriddenCmps}>
        <Provider store={this.store}>
          <Request userAvatar={userAvatar} permissions={permissions} />
        </Provider>
      </OverridableContext.Provider>
    );
  }
}

InvenioRequestsApp.propTypes = {
  requestsApi: PropTypes.object,
  overriddenCmps: PropTypes.object,
  requestEventsApi: PropTypes.object,
  request: PropTypes.object.isRequired,
  defaultQueryParams: PropTypes.object,
  userAvatar: PropTypes.string.isRequired,
  permissions: PropTypes.object.isRequired,
  commentContentMaxLength: PropTypes.number.isRequired,
};

InvenioRequestsApp.defaultProps = {
  overriddenCmps: {},
  requestsApi: null,
  requestEventsApi: null,
  defaultQueryParams: { size: 15 },
};
