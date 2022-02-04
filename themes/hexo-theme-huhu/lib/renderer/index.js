
module.exports = function (hexo) {
    const renderer = hexo.render.renderer.get('md')
    if (renderer) {
        renderer.disableNunjucks = true
        hexo.extend.renderer.register('md', 'html', renderer)
    }

}