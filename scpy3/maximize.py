imports = ['base/js/namespace']

def load(Jupyter):

    def maximize():
        header = jQuery('#header')
        if header['is'](':visible'):
            notification = jQuery('#notification_area')
            notification.css({'position':'absolute', 'width':'500px', 'bottom':'0px'})
            notification.appendTo(jQuery('body'))
            jQuery('#notebook').css({'padding-top':'0px'})
            jQuery('#scpy3-toc').css({'top':'0px'})
            header.hide()
            

    def normalize():
        header = jQuery('#header')
        if not header['is'](':visible'):
            notification = jQuery('#notification_area')
            notification.removeAttr('style')
            notification.insertAfter(jQuery('#modal_indicator'))
            jQuery('#notebook').removeAttr('style')
            top = jQuery("#header").height()
            jQuery('#scpy3-toc').css({'top':'%dpx' % top})
            header.show()

    def main():
        actions = dict(
            maximize = {
                'help': '',
                'icon': '',
                'key': 'Ctrl-up',
                handler: maximize
            },

            normalize = {
                'help': '',
                'icon': '',
                'key': 'Ctrl-down',
                handler: normalize
            }
        )
        
        km = Jupyter.keyboard_manager
        for name, action in actions.items():
            km.actions.register(action, name, 'scpy3')
            km.command_shortcuts.add_shortcut(action.key, 'scpy3:' + name)


    return {"load_ipython_extension": main}

define(imports, load)
    

