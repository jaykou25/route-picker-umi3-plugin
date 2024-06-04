import type { IApi } from "umi";
import { filterTree } from "./utils";
import { getRoutes } from "./utils/route";

export default (api: IApi) => {
  api.describe({
    key: "routePicker",
    config: {
      schema(joi) {
        return joi.array().items(joi.string());
      },
    },
    enableBy: () => {
      return api.env === "development";
    },
  });

  /**
   * 修改配置表中的 routers
   * 如果是约定式的路由, 那么自已去解析后再把它赋给 config.routes
   * 为什么要这样做呢?
   * 因为这样可以避免 umi 每次在热更新时反复的解析文件夹, 从而节省时间.
   */
  api.modifyConfig((config) => {
    const start = new Date().getTime();

    const myroutes = config.routers
      ? config.routers
      : getRoutes({
          root: api.paths.absPagesPath!,
          config,
        });

    const end = new Date().getTime();
    const timecost = (end - start) / 1000;
    console.log("解析项目文件得到路由表耗时：", timecost);

    // 去掉字符串前面的 /
    function stripSlash(str: string) {
      if (!str) return "";
      return str.replace(/^\/+/, "");
    }

    const { routePicker: pathArr } = config;
    if (pathArr && Array.isArray(pathArr) && pathArr.length > 0) {
      const result = filterTree(myroutes, (route) => {
        if (
          !route.path ||
          route.path === "/" ||
          pathArr.some((userPath) =>
            stripSlash(route.path.toLowerCase()).startsWith(
              stripSlash(userPath.toLowerCase())
            )
          )
        ) {
          return true;
        }

        return false;
      });
      config.routes = result;
    } else {
      config.routes = myroutes;
    }

    return config;
  });
};
