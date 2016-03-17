console.log($('body').css('background-color'))

$('html').css('backgound-color', 'white !important');

var Main = React.createClass({
    getInitialState: function() {
        return {poll: {question: '', answers: []}, view: 'form', selected: 0};
    },
    loadPoll: function() {
        $.get(
            this.props.url + '/getpoll/' + this.props.path, 
            function(poll) {
                this.setState({poll: poll});
            }.bind(this)
        );
    },
    componentDidMount: function() {
        this.loadPoll();
        $.get(
            '//freegeoip.net/json/',
            function(location) {
                this.setState({ip: location.ip});
            }.bind(this)
        );
    },
    handleSelect: function(e) {
        this.setState({selected: e.target.value}, function(){
        });
    },
    handleSubmit: function(e) {
        e.preventDefault();

        var votes = this.state.poll.votes;
        votes[this.state.selected]++;
        
        $.post(
            this.props.url + '/vote',
            {pollId: path, votes: votes, ip: this.state.ip},
            function(data) {
                this.setState({votes: votes});
                this.setState({view: 'results'});
            }.bind(this));
    },
    results: function() {
        this.setState({view: 'results'});
    },
    render: function() {
        if(this.state.view == 'form') {
            return (
                <div className='poll-main'>
                    <div className='question-out'>{this.state.poll.question}</div>
                    <AnswerForm 
                        answers={this.state.poll.answers}
                        submit={this.handleSubmit}
                        results={this.results}
                        click={this.handleSelect}
                    />
                </div>
        )}
        if(this.state.view == 'results') {
            console.log(this.state.votes, 'poll: ', this.state.poll.votes)
            var totVotes = this.state.poll.votes.reduce(function(p, n) {
                return +p + +n;
            })
            return (
                <div className='poll-main'>
                    <div className='question-out'>{this.state.poll.question}</div>
                    <Results 
                        answers={this.state.poll.answers}
                        votes={this.state.poll.votes}
                        totVotes={totVotes}
                    />
                    <div className='tot-votes'>{'Total Votes: ' + totVotes}</div>
                </div>
        )}
    }
});

var AnswerForm = React.createClass({
    getInitialState: function() {
        return({answers: []})
    },
    render: function() {
        var answerNodes = (this.props.answers || []).map(function(answer,i) {
            return (
                <div className='answer-out'>
                    <input 
                        type="radio" 
                        name="answer" 
                        value={i} 
                        defaultChecked={!i}
                        onClick={this.props.click}
                    /> 
                        {answer} 
                </div>
            )
        }.bind(this))
        return (
            <div>
                {answerNodes}
                <button className='vote' onClick={this.props.submit}> Vote </button>
                <button className='vote' onClick={this.props.results}> Results </button>
            </div>
        )
    }
})

var Results = React.createClass({
    render: function() {
        var answerNodes = this.props.answers.map(function(answer,i) {
            var percentage = Math.floor(this.props.votes[i] / this.props.totVotes * 100) + '%';
            return (
                <div className='answer-out'>{answer + ': ' + percentage}</div>
            )
        }.bind(this))
        return (
            <div>
                {answerNodes}  
            </div>
        )
    }
})

var path = document.URL.split('/').reverse()[0];


ReactDOM.render(<Main path={path} url='https://poller-jjamesg.c9users.io' />, document.getElementById('contentR'));


