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

import { ChartConfig } from 'app/types/ChartConfig';

const config: ChartConfig = {
  datas: [
    {
      label: 'dimension',
      key: 'dimension',
      required: true,
      type: 'group',
    },
    {
      label: 'metrics',
      key: 'metrics',
      required: true,
      type: 'aggregate',
    },
    {
      label: 'filter',
      key: 'filter',
      type: 'filter',
      allowSameField: true,
    },
  ],
  styles: [
    {
      label: 'scroll.title',
      key: 'scroll',
      comType: 'group',
      rows: [
        {
          label: 'scroll.step',
          key: 'step',
          default: 1,
          comType: 'inputNumber',
        },
        {
          label: 'scroll.interval',
          key: 'interval',
          default: 50,
          comType: 'inputNumber',
        },
        {
          label: 'scroll.lineHeight',
          key: 'lineHeight',
          default: 40,
          comType: 'inputNumber',
        },
        {
          label: 'scroll.hoverStop',
          key: 'hoverStop',
          default: true,
          comType: 'checkbox',
        },
      ],
    },
    {
      label: 'style.title',
      key: 'style',
      comType: 'group',
      rows: [
        {
          label: 'style.font',
          key: 'font',
          comType: 'font',
          default: {
            fontFamily: 'sans-serif',
            fontSize: 14,
            fontWeight: 'normal',
            fontStyle: 'normal',
            color: '#000',
          },
        },
        {
          label: 'style.backgroundColor',
          key: 'backgroundColor',
          comType: 'colorWhite',
          default: 'transparent',
        },
      ],
    },
  ],
  i18ns: [
    {
      lang: 'zh-CN',
      translation: {
        dimension: '维度',
        metrics: '指标',
        scroll: {
          title: '滚动设置',
          step: '步长',
          interval: '时间间隔(ms)',
          lineHeight: '行高',
          hoverStop: '鼠标悬停停止',
        },
        style: {
          title: '样式设置',
          font: '字体',
          backgroundColor: '背景颜色',
        },
      },
    },
    {
      lang: 'en-US',
      translation: {
        dimension: 'Dimension',
        metrics: 'Metrics',
        scroll: {
          title: 'Scroll Settings',
          step: 'Step',
          interval: 'Interval(ms)',
          lineHeight: 'Line Height',
          hoverStop: 'Stop on Hover',
        },
        style: {
          title: 'Style Settings',
          font: 'Font',
          backgroundColor: 'Background Color',
        },
      },
    },
  ],
};

export default config;
