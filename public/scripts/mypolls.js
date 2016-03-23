var Main = React.createClass({
    getInitialState: function() {
        return (
            {polls: []}
        );
    },
    componentDidMount: function() {
        $.get(
            this.props.url + '/user',
            function(user) {
                this.setState({user: user});
            }.bind(this)
        );
        this.loadPolls();
    },
    loadPolls: function() {

        $.get(
            this.props.url + '/mypolls/search',  // 0?????????????????????????
            function(polls) {
                console.log(polls)
                this.setState({polls: polls})
            }.bind(this)
        );
    },
    delete: function(e) {
        $.post(
            this.props.url + '/delete',
            { id: e.target.id },
            function() {
                console.log('inside')
                this.loadPolls();
            }.bind(this)
        )
    },
    render: function() {
        return(
            <div className='mypolls'>
                <div className='label'>
                    <p className='myq'> My Polls </p>
                    <p className='myv'> Votes </p>
                </div>
                {!this.state.polls.length ? <p>You don't have any polls! <a href='/'> Create some! </a> </p> : null} 
                {this.state.polls.map(poll=>
                    (
                    <div className='myrow'>
                        <a href={'/poll/' + poll._id}>
                            <div className='myquestion'>{poll.question}</div>
                            <div className='myvotes'>{poll.votes.reduce((x,y)=>x+y)}</div>
                        </a>
                        <button className='mydelete' id={poll._id} onClick={this.delete}>X</button>
                    </div>
                    )
                )}
            
            </div>
        );
    }
});



ReactDOM.render(<Main url='https://pollerq.herokuapp.com/' />, document.getElementById('contentR'));


