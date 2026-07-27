import PropTypes from 'prop-types'

function AIAnalysisButton({ disabled, isAnalyzing, onClick }) {
  return (
    <button
      type="button"
      className="btn ai-btn"
      onClick={onClick}
      disabled={disabled || isAnalyzing}
      aria-busy={isAnalyzing}
      aria-label="Get AI suggestions for this task"
    >
      {isAnalyzing ? (
        <>
          <span className="spinner tiny" aria-hidden="true" />
          AI is analyzing...
        </>
      ) : (
        'AI Analysis'
      )}
    </button>
  )
}

AIAnalysisButton.propTypes = {
  disabled: PropTypes.bool,
  isAnalyzing: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
}

AIAnalysisButton.defaultProps = {
  disabled: false,
  isAnalyzing: false,
}

export default AIAnalysisButton
