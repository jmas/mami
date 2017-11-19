# Mami

This is the one who cares about your dependencies.

## Example

```js
import mami from 'mami';

const get = mami({
    loadModule: moduleName => import(`./modules/${moduleName}`).then(exports => exports['default']),
    modules: {
        dispatcher: load => load('dispatcher'),
        views: load => load('views'),
        router: load => load('router'),
        app: {
            dispatcher: get => get('dispatcher'),
            views: get => get('views').then(views => views({
                globals: {
                    appName: 'Welcome'
                }
            })),
            router: get => get('router'),
        }
    }
});

get('app').then(app => app.render(document.body));
```

## API

### `mami(options: Object): Function`

| `options.loadModule: Function` | Function that load modules. It should return `Promise` that should return loaded module content. |
| --- | --- |
| `options.modules: Object` | Keys of that object is a module name (any word). Values is a object or function that tell mami what dependencies is required. |

Returns function that give you ability to get any described module.

```js
const get = mami({
    loadModule,
    modules: {
        a: load => load('my_a')
    }
});
get('a') // returns Promise
    .then(aModuleContent => {
        console.log(aModuleContent);
    })
    .catch(error => console.log(error));
```
