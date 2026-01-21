# datart 项目深度技术分析报告

## 1. 整体技术架构分析

datart 采用了典型的现代全栈架构，后端基于 Java Spring Boot 微服务架构理念（虽然目前是单体多模块部署），前端基于 React 生态系统。

### 1.1 多模块（Multi-module）结构
项目采用 Maven 进行多模块管理，各模块职责清晰：

*   **`datart-parent`**: 根模块，管理全局依赖版本和公共配置。
*   **`core`**: 核心模块，包含通用的实体类（Entity）、MyBatis Mapper 接口、异常处理、工具类以及数据提供者基类。
*   **`security`**: 安全模块，集成 Apache Shiro 实现权限控制（RBAC），处理身份验证、授权、加密等逻辑。
*   **`data-providers`**: 数据提供者模块，采用插件化设计，包含多种数据源实现：
    *   `jdbc-data-provider`: 支持主流关系型数据库（MySQL, PostgreSQL, Oracle 等）。
    *   `http-data-provider`: 支持通过 HTTP 接口获取数据。
    *   `file-data-provider`: 支持 Excel, CSV 等文件。
*   **`server`**: 业务逻辑层，包含 RESTful 控制器（Controller）、服务层（Service）实现、定时任务（Job）以及应用程序入口。
*   **`frontend`**: 基于 React 的前端应用，负责 UI 渲染、状态管理及可视化展现。

### 1.2 后端核心服务、前端 React 应用与可视化引擎的解耦与交互
*   **前后端分离**: 通过标准的 RESTful API 进行交互，JSON 作为数据交换格式。
*   **可视化引擎插件化**: 前端可视化部分（`frontend/src/app/components/ChartGraph`）设计了一套通用的 `Chart` 基类和插件机制。每个图表（如 `BasicBarChart`）都是一个独立的插件，负责将后端返回的标准数据集（Dataframe）转化为 ECharts 配置。这种设计使得扩展新的图表类型无需修改核心框架逻辑。
*   **数据执行引擎解耦**: 后端通过 `DataProviderManager` 统一管理各种 `DataProvider`。业务逻辑层只需调用 `execute` 接口，而无需关心底层数据源的具体实现和连接细节。

---

## 2. 核心业务逻辑分析：从“数据视图”到“仪表板”渲染

### 2.1 完整代码调用链

1.  **数据视图创建 (View Creation)**:
    *   **前端**: 用户在 `ViewPage` 编写 SQL 或脚本。
    *   **后端**: `ViewController.create` -> `ViewServiceImpl.create`。
    *   **持久化**: 将 SQL 脚本、数据模型（Model）、变量等信息存入 `view` 表。

2.  **仪表板加载 (Dashboard Loading)**:
    *   **前端**: 用户打开 `DashBoardPage`，发起 API 请求：`GET /viz/dashboards/{id}`。
    *   **后端**: `VizController.getDashboard` -> `DashboardServiceImpl.getDashboardDetail`。
    *   **逻辑**: 从数据库加载 Dashboard 元数据、所属的 Widgets（小组件）、关联的 Datacharts（数据图表）及其 View 元数据。
    *   **返回**: 返回一个包含完整布局和元数据的 `DashboardDetail` 对象。

3.  **数据执行 (Data Execution)**:
    *   **前端**: Dashboard 组件渲染后，每个 Chart 组件会触发数据请求：`POST /data-provider/execute`。
    *   **后端**: `DataProviderController.execute` -> `DataProviderServiceImpl.execute`。
    *   **核心逻辑**:
        1.  通过 `viewId` 检索 `View` 实体。
        2.  解析 `ViewExecuteParam`（包含过滤条件、聚合、分组等）。
        3.  组合 SQL/脚本与变量。
        4.  调用 `DataProviderManager.execute`。
        5.  `JdbcDataProvider`（以 JDBC 为例）执行最终 SQL。
    *   **返回**: 返回标准的 `Dataframe` 数据格式。

4.  **渲染 (Rendering)**:
    *   **前端**: `ChartIFrameContainer` 接收到 `Dataframe`。
    *   **引擎**: 调用对应的图表插件（如 `BasicBarChart.onUpdated`）。
    *   **转化**: 插件将 `Dataframe` 转换为 ECharts 的 `option`。
    *   **展现**: ECharts 将图表绘制在指定的 DOM 容器中。

---

## 3. 关键技术实现：权限控制（RBAC）

datart 实现了细粒度的权限控制，支持组织、文件夹、资源、列级甚至行级的权限分配。

### 3.1 实现方式
*   **核心框架**: Apache Shiro。
*   **身份验证与授权**: 通过 `DatartRealm` 实现。它从数据库中读取用户信息和权限信息。
*   **安全管理**: `ShiroSecurityManager` 封装了 Shiro 的核心操作，并提供了一系列 `requirePermission` 方法。

### 3.2 核心类与配置文件
*   **核心类**:
    *   `datart.security.manager.shiro.DatartRealm`: 处理登录和权限加载。
    *   `datart.security.manager.shiro.ShiroSecurityManager`: 权限校验的核心入口。
    *   `datart.server.service.impl.BaseService`: 提供了便捷的权限检查方法供子类调用。
*   **配置文件**:
    *   `security/src/main/java/datart/security/manager/shiro/SecurityConfiguration.java`: Shiro 的 Spring 配置类，定义了过滤链、Session 管理和缓存配置。
*   **权限实体**:
    *   `Role`: 角色实体。
    *   `RelRoleResource`: 角色与资源的关联表，定义了特定角色对特定资源的权限（READ, MANAGE, GRANT 等）。

---

## 4. 开发与环境指引

### 4.1 后端环境搭建
*   **依赖工具**: JDK 1.8+, Maven 3.6+, MySQL 5.7+。
*   **数据库初始化**:
    *   脚本路径: `server/src/main/resources/db/migration/`。
    *   datart 使用 Flyway 自动管理数据库版本，首次启动会自动执行 `V...__baseline.sql` 及后续升级脚本。
*   **启动步骤**:
    1.  创建名为 `datart` 的数据库。
    2.  修改 `server/src/main/resources/application.yml` 中的数据库连接配置。
    3.  运行 `datart.DatartServerApplication` 的 `main` 方法。

### 4.2 前端构建
*   **依赖工具**: Node.js (推荐 v14+), npm 或 yarn。
*   **构建步骤**:
    1.  `cd frontend`
    2.  `npm install` (或 `yarn`)
    3.  `npm start` (开发模式) 或 `npm run build` (生产模式)。

### 4.3 数据库初始化脚本位置总结
*   **主脚本**: `server/src/main/resources/db/migration/V2022.02.18__baseline.sql` (包含完整的表结构初始化)。
*   **增量脚本**: 同目录下以 `V...` 开头的其他文件。
