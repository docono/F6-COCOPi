<field-time>

    <input name="input" class="uk-width-1-1" bind="{ opts.bind }" type="text">

    <script>

        var $this = this;

        if (opts.cls) {
            App.$(this.input).addClass(opts.cls);
        }

        if (opts.required) {
            this.input.setAttribute('required', 'required');
        }

        this.on('mount', function(){

            App.assets.require(['/assets/lib/uikit/js/components/timepicker.js'], function() {

                UIkit.timepicker(this.input, opts).element.on('change', function() {
                    $this.input.$setValue($this.input.value);
                });

            }.bind(this));
        });

    </script>

</field-time>
