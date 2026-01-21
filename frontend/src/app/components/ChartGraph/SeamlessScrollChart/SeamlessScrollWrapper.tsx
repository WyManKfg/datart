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

import React, { FC, memo, useEffect, useRef, useState } from 'react';
import styled from 'styled-components/macro';

export interface SeamlessScrollWrapperProps {
  data: any[];
  config: {
    step: number;
    interval: number;
    lineHeight: number;
    hoverStop: boolean;
    font: any;
    backgroundColor: string;
  };
}

const SeamlessScrollWrapper: FC<SeamlessScrollWrapperProps> = memo(
  ({ data, config }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isHover, setIsHover] = useState(false);
    const [y, setY] = useState(0);

    useEffect(() => {
      if (config.hoverStop && isHover) return;

      const timer = setInterval(() => {
        if (scrollRef.current) {
          const { scrollHeight, clientHeight } = scrollRef.current;
          if (scrollHeight <= clientHeight) {
            setY(0);
            return;
          }

          setY(prevY => {
            const nextY = prevY + config.step;
            if (nextY >= scrollHeight / 2) {
              return 0;
            }
            return nextY;
          });
        }
      }, config.interval);

      return () => clearInterval(timer);
    }, [config, isHover]);

    const displayData = [...data, ...data];

    return (
      <Container
        style={{ backgroundColor: config.backgroundColor }}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <ScrollContent
          ref={scrollRef}
          style={{ transform: `translateY(-${y}px)` }}
        >
          {displayData.map((item, index) => (
            <Row
              key={index}
              style={{
                height: config.lineHeight,
                lineHeight: `${config.lineHeight}px`,
                ...config.font,
              }}
            >
              <span className="dimension">{item.dimension}</span>
              <span className="metrics">{item.metrics}</span>
            </Row>
          ))}
        </ScrollContent>
      </Container>
    );
  },
);

const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
`;

const ScrollContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  transition: transform 0.1s linear;
`;

const Row = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid #f0f0f0;

  .dimension {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .metrics {
    margin-left: 16px;
    font-weight: bold;
  }
`;

export default SeamlessScrollWrapper;
