/**
 * Datart
 *
 * Copyright 2021
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import ReactChart from 'app/models/ReactChart';
import { ChartConfig } from 'app/types/ChartConfig';
import ChartDataSetDTO from 'app/types/ChartDataSet';
import { BrokerContext, BrokerOption } from 'app/types/ChartLifecycleBroker';
import { getStyles, transformToDataSet } from 'app/utils/chartHelper';
import Config from './config';
import SeamlessScrollWrapper from './SeamlessScrollWrapper';

class SeamlessScrollChart extends ReactChart {
  isISOContainer = 'react-seamless-scroll';
  config = Config;
  useIFrame = false;

  constructor() {
    super(SeamlessScrollWrapper, {
      id: 'seamless-scroll',
      name: 'Seamless Scroll List',
      icon: 'list',
    });
  }

  onUpdated(options: BrokerOption, context: BrokerContext) {
    if (!this.isMatchRequirement(options.config)) {
      this.adapter?.unmount();
      return;
    }
    this.adapter?.updated(
      this.getOptions(context, options.dataset!, options.config!),
      context,
    );
  }

  getOptions(
    context: BrokerContext,
    dataset: ChartDataSetDTO,
    config: ChartConfig,
  ) {
    const styleConfigs = config.styles || [];
    const dataConfigs = config.datas || [];

    const chartDataSet = transformToDataSet(
      dataset.rows,
      dataset.columns,
      dataConfigs,
    );

    const dimensionField = dataConfigs.find(c => c.key === 'dimension')?.rows?.[0];
    const metricsField = dataConfigs.find(c => c.key === 'metrics')?.rows?.[0];

    const data = chartDataSet.map(row => ({
      dimension: dimensionField ? row.getCell(dimensionField) : '',
      metrics: metricsField ? row.getCell(metricsField) : '',
    }));

    const [step, interval, lineHeight, hoverStop] = getStyles(
      styleConfigs,
      ['scroll'],
      ['step', 'interval', 'lineHeight', 'hoverStop'],
    );

    const [font, backgroundColor] = getStyles(
      styleConfigs,
      ['style'],
      ['font', 'backgroundColor'],
    );

    return {
      data,
      config: {
        step,
        interval,
        lineHeight,
        hoverStop,
        font,
        backgroundColor,
      },
    };
  }
}

export default SeamlessScrollChart;
