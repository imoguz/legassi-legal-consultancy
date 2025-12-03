import { notification } from "antd";

export const notify = {
  success: (title, description) => {
    if (typeof window !== "undefined") {
      notification.success({
        title,
        description,
        duration: 5,
        placement: "topRight",
      });
    }
  },
  error: (title, description) => {
    if (typeof window !== "undefined") {
      notification.error({
        title,
        description,
        duration: 5,
        placement: "topRight",
      });
    }
  },
  warning: (title, description) => {
    if (typeof window !== "undefined") {
      notification.warning({
        title,
        description,
        duration: 5,
        placement: "topRight",
      });
    }
  },
  info: (title, description) => {
    if (typeof window !== "undefined") {
      notification.info({
        title,
        description,
        duration: 5,
        placement: "topRight",
      });
    }
  },
};
