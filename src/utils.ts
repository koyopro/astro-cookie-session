export type Nullable<T> = {
  [P in keyof T]: T[P] | undefined;
};

export const addDictInterface = (obj: any, props: string[], methods: string[] = []) => {
  return new Proxy(obj, {
    get(target, key, receiver) {
      if (props.includes(key as string))
        return Reflect.get(target, key, receiver);
      if (methods.includes(key as string)) {
        return Reflect.get(target, key, receiver).bind(target);
      }
      return target.get(key);
    },
    set(target, key, value) {
      target.set(key, value);
      return true;
    },
  }) as any;
};
