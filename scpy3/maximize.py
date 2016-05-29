imports = ['base/js/namespace', 'base/js/events']

def load(Jupyter, events):
    header = jQuery('#header')    
    
    def maximize():
         if header['is'](':visible'):
            notification = jQuery('#notification_area')
            notification.css({'position':'absolute', 'width':'500px', 'bottom':'0px'})
            notification.appendTo(jQuery('body'))
            jQuery('#notebook').css({'padding-top':'0px'})
            jQuery('div#maintoolbar').hide()
            jQuery('#header-container').hide()
            jQuery('.header-bar').hide()
            jQuery('#menubar-container').hide()
            jQuery('#header').hide()
            events.trigger('resize-header.Page')

    def normalize():
         if not header['is'](':visible'):
            notification = jQuery('#notification_area')
            notification.removeAttr('style')
            notification.insertAfter(jQuery('#modal_indicator'))
            jQuery('#notebook').removeAttr('style')
            jQuery('div#maintoolbar').show()
            jQuery('#header-container').show()
            jQuery('.header-bar').show()
            jQuery('#menubar-container').show()
            jQuery('#header').show()
            events.trigger('resize-header.Page')

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
    

