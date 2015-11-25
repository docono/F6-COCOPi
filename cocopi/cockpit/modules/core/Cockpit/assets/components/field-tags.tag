<field-tags>

    <div>

        <div name="autocomplete" class="uk-autocomplete uk-form-icon uk-form">
            <i class="uk-icon-tag"></i>
            <input name="input" class="uk-width-1-1 uk-form-blank" type="text" placeholder="{ App.i18n.get(opts.placeholder || 'Add Tag...') }">
        </div>

        <div class="uk-margin uk-panel uk-panel-box" show="{ tags && tags.length }">
            <div class="uk-margin-small-right uk-margin-small-top" each="{ tag,idx in tags }">
                <a onclick="{ parent.remove }"><i class="uk-icon-close"></i></a> { tag }
            </div>
        </div>

    </div>

    <script>

        var $this = this;

        this.tags = [];

        this.on('mount', function(){

            if (opts.autocomplete) {

                UIkit.autocomplete(this.autocomplete, {source: opts.autocomplete});
            }

            App.$(this.input).on('keydown change', function(e) {

                if (e.type=='keydown' && e.keyCode != 13) {
                    return;
                }

                if ($this.input.value.trim()) {

                    e.stopImmediatePropagation();
                    e.stopPropagation();
                    $this.tags.push($this.input.value);
                    $this.input.value = "";
                    $this.$setValue($this.tags);
                    $this.update();

                    return false;
                }
            });
        });

        this.$updateValue = function(value) {

            if (!Array.isArray(value)) {
                value = [];
            }

            if (this.tags !== value) {
                this.tags = value;
                this.update();
            }

        }.bind(this);

        remove(e) {
            this.tags.splice(e.item.idx, 1);
            this.$setValue(this.tags);
        }

    </script>

</field-tags>
