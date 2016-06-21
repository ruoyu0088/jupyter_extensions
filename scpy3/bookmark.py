imports = ['base/js/namespace', 'base/js/events', 'require', 'notebook/js/tooltip', 'base/js/utils']

N = 3

patch_code = """

Tooltip.Tooltip.prototype._show = function(reply){
        /**
         * move the bubble if it is not hidden
         * otherwise fade it
         */
        this._reply = reply;
        var content = reply.content;
        if (!content.found) {
            // object not found, nothing to show
            return;
        }
        this.name = content.name;

        // do some math to have the tooltip arrow on more or less on left or right
        // position of the editor
        var cm_element = $(this.code_mirror.getWrapperElement());
        var pos1 = cm_element.position();
        var pos2 = cm_element.closest("div.cell").position();
        var cm_pos = {top:pos1.top + pos2.top, left:pos1.left + pos2.left};
        // anchor and head positions are local within CodeMirror element
        var anchor = this.code_mirror.cursorCoords(false, 'local');
        var head = this.code_mirror.cursorCoords(true, 'local');
        // locate the target at the center of anchor, head
        var center_left = (head.left + anchor.left) / 2;
        // locate the left edge of the tooltip, at most 450 px left of the arrow
        var edge_left = Math.max(center_left - 450, 0);
        // locate the arrow at the cursor. A 24 px offset seems necessary.
        var arrow_left = center_left - edge_left - 24;
        
        // locate left, top within container element
        var left = (cm_pos.left + edge_left) + 'px';
        var top = (cm_pos.top + head.bottom + 10) + 'px';

        if (this._hidden === false) {
            this.tooltip.animate({
                left: left,
                top: top
            });
        } else {
            this.tooltip.css({
                left: left
            });
            this.tooltip.css({
                top: top
            });
        }
        this.arrow.animate({
            'left': arrow_left + 'px'
        });
        
        this._hidden = false;
        this.tooltip.fadeIn('fast');
        this.text.children().remove();
        
        // This should support rich data types, but only text/plain for now
        // Any HTML within the docstring is escaped by the fixConsole() method.
        var pre = $('<pre/>').html(utils.fixConsole(content.data['text/plain']));
        this.text.append(pre);
        // keep scroll top to be sure to always see the first line
        this.text.scrollTop(0);
};


"""

def load(Jupyter, events, require, Tooltip, utils):
    from .utils import load_css, show_message, register_actions

    eval(patch_code)
    
    load_css('./bookmark.css')
    
    nb = Jupyter.notebook
    
    def toggle_bookmark(mark_id):
        cell = nb.get_selected_cell()
        for i in range(1, N+1):
            if i == mark_id:
                continue
            cell.element.removeClass('cell-bookmark-%d' % i)
            
        cell.element.toggleClass('cell-bookmark-%d' % mark_id)
        if cell.element.hasClass('cell-bookmark-%d' % mark_id):
            cell.metadata.scpy3_bookmark = mark_id
        else:
            del cell.metadata.scpy3_bookmark

    def run_bookmark(mark_id):
        cells = nb.get_cells()
        count = 0
        for cell in cells:
            if cell.cell_type == 'code' and cell.metadata.scpy3_bookmark == mark_id:
                cell.execute()
                count += 1
        show_message('%d cells executed' % count, 2000)
        
    def search_bookmark(step):
        console.log('next_bookmark')
        cells = nb.get_cells()
        start = nb.get_selected_index()
        if step > 0:            
            indexes = range(start+1, len(cells)) + range(0, start)
        else:
            indexes = range(start-1, -1, -1) + range(len(cells)-1, start, -1)

        for i in indexes:
            cell = cells[i]
            if cell.metadata.scpy3_bookmark:
                nb.select(i)
                nb.scroll_to_cell(i)
                break
        else:
            show_message('No bookmark', 2000)
            
    def next_bookmark():
        search_bookmark(1)

    def prev_bookmark():
        search_bookmark(-1)
    
    def main():
        actions = dict(
            toggle_bookmark_1 = {
                'help': 'toogle bookmark 1',
                'icon': 'fa-bookmark',
                'key': 'Shift-1',
                handler: lambda :toggle_bookmark(1)
            },
            
            toggle_bookmark_2 = {
                'help': 'toggle bookmark 2',
                'icon': 'fa-bookmark',
                'key': 'Shift-2',
                handler: lambda :toggle_bookmark(2)
            },
            
            toggle_bookmark_3 = {
                'help': 'toggle bookmark 3',
                'icon': 'fa-bookmark',
                'key': 'Shift-3',
                handler: lambda :toggle_bookmark(3)
            },

            run_cells_with_bookmark_1 = {
                'help': 'run cells with bookmark 1',
                'icon': 'fa-play-circle',
                'key': 'Ctrl-Shift-1',
                handler: lambda :run_bookmark(1)
            },
            
            run_cells_with_bookmark_2 = {
                'help': 'run cells with bookmark 2',
                'icon': 'fa-play-circle',
                'key': 'Ctrl-Shift-2',
                handler: lambda :run_bookmark(2)
            },
            
            run_cells_with_bookmark_3 = {
                'help': 'run cells with bookmark 3',
                'icon': 'fa-play-circle',
                'key': 'Ctrl-Shift-3',
                handler: lambda :run_bookmark(3)
            },

            jump_to_next_bookmark = {
                'help': 'jump to next bookmark',
                'icon': 'fa-hand-o-right',
                'key': 'Shift-right',
                handler: next_bookmark
            },

            jump_to_previous_bookmark = {
                'help': 'jump to previous bookmark',
                'icon': 'fa-hand-o-left',
                'key': 'Shift-left',
                handler: prev_bookmark
            }

        )

        register_actions(actions)

        for cell in nb.get_cells():
            if cell.metadata.scpy3_bookmark:
                cell.element.addClass('cell-bookmark-%d' % int(cell.metadata.scpy3_bookmark))
                    
    return {"load_ipython_extension": main}

define(imports, load)
    

