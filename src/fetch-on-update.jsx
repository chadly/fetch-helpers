import React, { Component } from "react";
import shallowEqual from "shallowequal";
import { mapParams } from "./connect";

const fetchOnUpdate = (fn, ...keys) => DecoratedComponent =>
	class FetchOnUpdateDecorator extends Component {
		componentDidMount() {
			fn(this.props);
		}

		componentDidUpdate(prevProps) {
			// if they didn't specify any keys, we effectively only run the fetch function once on init
			if (keys.length < 1) return;

			const params = mapParams(keys, this.props);
			const prevParams = mapParams(keys, prevProps);

			if (!shallowEqual(params, prevParams)) {
				fn(this.props);
			}
		}

		render() {
			return <DecoratedComponent {...this.props} />;
		}
	};

export default fetchOnUpdate;
