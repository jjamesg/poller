$(function() {
    
    
    $('.submitlog').click(function() {
        $.post(
            '/login',
            { username: $('.username').val(), password: $('.password').val() },
            function(user){
                console.log(user)
                if(!user) {
                    $('.error-box').html('Invalid username or password.')
                }
                else window.location.replace("/");
            }
        );
    })
    
    $('.submitreg').click(function() {
        console.log( $('.usernamer').val())
        $.post(
            '/register',
            { username: $('.usernamer').val(), password: $('.passwordr').val() },
            function(success){
                console.log(success)
                if(!success) {
                    $('.error-boxr').html('Username already exists.')
                }
                else window.location.replace("/");
            }
        );
    })
    
    $('.username').change(function() {
        console.log('changed')
        $('.error-box').html('')
        
    });
    
    
    $('.loading').hide();
    
    $(document).on({
        ajaxStart: function() { $('.loading').show() },
         ajaxStop: function() { $('.loading').hide() }    
    });
    
});