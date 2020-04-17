import React from 'react';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import $ from 'jquery';
import MTooltip from 'components/ui/MTooltip';
import Input from '../input/input';
import ArrowButton from '../arrow-button/arrowButton';
import advice01 from '../../images/advice-01.png';
import { BOOL, errorMessages } from '../../dataTypes';

const SortableDataOperation = SortableElement(({ value, prefix }) => {
  const { index } = value;
  function handleSelectClick(advancedParamIndex, newBoolValue) {
    $(`#advanced-drop-down-${value.index}-param-${advancedParamIndex}`).click();
    $(`#paragraph-op-${value.index}-value-${advancedParamIndex}`).text(newBoolValue ? 'Yes' : 'No');
    document
      .getElementById(
        `ad-hidden-input-advanced-drop-down-${value.index}-param-${advancedParamIndex}`,
      )
      .value = newBoolValue;
  }

  return (
    <span key={`data-operations-item-selected-${index}`} style={{ height: 'auto', display: 'flex', alignItems: 'center' }}>
      <p style={{ marginRight: '15px' }}>
        <b>
          {prefix || 'Op.'}
          {value.index}
          :
        </b>
      </p>
      <div
        className="data-operations-item round-border-button shadowed-element"
        id={`data-operations-item-selected-${value.index}`}
        key={`data-operations-item-selected-${value.index}`}
      >
        <div className="header flexible-div">
          <div id="title-content">
            <p className="bold-text">{value.title}</p>
            <p>
              Created by
              <span className="bold-text">{value.username}</span>
            </p>
          </div>
          <div id={`data-options-second-${value.index}`} className="data-oper-options flexible-div ">
            <div>
              <button
                type="button"
                label="close"
                id={`delete-btn-item-${value.index}`}
                onClick={value.deleteDataOperationEvent}
                className="btn btn-icon btn-hidden p-1 mr-1 fa fa-times"
              />
            </div>
            <div>
              <button
                type="button"
                label="copy"
                id={`copy-btn-item-${value.index}`}
                onClick={value.copyDataOperationEvent}
                className="btn btn-icon btn-hidden p-1 fa fa-copy mr-1"
              />
            </div>
            <div>
              <ArrowButton
                placeholder=""
                params={{ index: value.index }}
                callback={() => {
                  const formDiv = document.getElementById(`data-operation-selected-form-${value.index}`);
                  formDiv.style.display = formDiv.style.display === 'none' ? 'unset' : 'none';
                }}
              />
            </div>
          </div>
        </div>
        <div id={`data-operation-selected-form-${value.index}`} className="data-operation-form" style={{ display: 'none' }}>
          <br />
          {value.params.standard.map((param, paramIndex) => (
            <div key={`std-${param.name}`}>
              <div style={{ display: 'flex' }}>
                <p style={{ width: '14em' }}>
                  {param.comment && (
                    <MTooltip
                      scale={120}
                      className="mr-1"
                      message={param.comment}
                    />
                  )}
                  {`${param.name}: `}
                </p>
                <div className="my-auto">
                  <Input id={`param-${paramIndex}-item-data-operation-selected-form-${value.index}`} placeholder="" value={param.value} />
                </div>
              </div>
              <div id={`error-div-for-param-${paramIndex}-item-data-operation-selected-form-${value.index}`} style={{ display: 'none' }}>
                <img style={{ height: '15px' }} src={advice01} alt="" />
                <p style={{ margin: '0 0 0 5px' }}>{errorMessages[param.dataType]}</p>
              </div>
            </div>
          ))}

          {value.params.advanced
            && (
            <div>
              <div className="advanced-opt-drop-down">
                <div className="drop-down">
                  <p className="mr-2"><b>Advanced</b></p>
                  <ArrowButton
                    placeholder=""
                    params={{ index: value.index }}
                    callback={() => {
                      const formDiv = document.getElementById(`advanced-opts-div-${value.index}`);
                      formDiv.style.display = formDiv.style.display === 'none' ? 'unset' : 'none';
                    }}
                  />
                </div>
                <div style={{ width: '50%', textAlign: 'end' }}>
                  <p><b>Source code</b></p>
                </div>
              </div>
              <div id={`advanced-opts-div-${value.index}`} className="advanced-opts-div" style={{ display: 'none' }}>
                {value.params.advanced.map((advancedParam, advancedParamIndex) => (
                  advancedParam.dataType === BOOL
                    ? (
                      <div key={`adv-${advancedParam.name}`} style={{ display: 'flex' }}>
                        <p style={{ width: '14em' }}>
                          {advancedParam.comment && (
                            <MTooltip
                              scale={120}
                              className="mr-1"
                              message={advancedParam.comment}
                            />
                          )}
                          {`${advancedParam.name}: `}
                        </p>
                        <div>
                          <input
                            id={`ad-hidden-input-advanced-drop-down-${value.index}-param-${advancedParamIndex}`}
                            style={{ display: 'none' }}
                            onChange={() => { }}
                            value={advancedParam.value}
                          />
                          <div style={{ display: 'flex' }}>
                            <ArrowButton
                              id={`advanced-drop-down-${value.index}-param-${advancedParamIndex}`}
                              params={{ index: value.index }}
                              callback={() => {
                                const el = document.getElementById(`options-for-bool-select-${advancedParamIndex}`);

                                el.style.display = el.style.display === 'none'
                                  ? 'unset'
                                  : 'none';
                              }}
                            />
                            <p
                              id={`paragraph-op-${value.index}-value-${advancedParamIndex}`}
                            >
                              {advancedParam.value === 'true' ? 'Yes' : 'No'}
                            </p>
                          </div>
                          <div style={{ display: 'none' }} id={`options-for-bool-select-${advancedParamIndex}`}>
                            <ul style={{
                              boxShadow: '0 2px 4px rgb(0, 0, 0, 0.3)',
                              display: 'block !important',
                              position: 'absolute',
                              width: '80px',
                              height: 'auto',
                              background: '#fff',
                              borderRadius: '1em',
                            }}
                            >
                              <li>
                                <button
                                  type="button"
                                  style={{ border: 'none', backgroundColor: 'transparent' }}
                                  onClick={() => handleSelectClick(advancedParamIndex, true)}
                                >
                                  Yes
                                </button>
                              </li>
                              <li>
                                <button
                                  type="button"
                                  style={{ border: 'none', backgroundColor: 'transparent' }}
                                  onClick={
                                    () => handleSelectClick(advancedParamIndex, false)
                                  }
                                >
                                  No
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>

                      </div>
                    )
                    : (
                      <div key={`adv-${advancedParam.name}`}>
                        <div style={{ display: 'flex' }}>
                          <p style={{ width: '14em' }}>
                            {advancedParam.comment && (
                              <MTooltip
                                scale={120}
                                className="mr-1"
                                message={advancedParam.comment}
                              />
                            )}
                            {`${advancedParam.name}: `}
                          </p>
                          <Input
                            id={`ad-param-${advancedParamIndex}-item-data-operation-form-${value.index}`}
                            placeholder={String(advancedParam.standardValue)}
                            value={advancedParam.value}
                          />
                        </div>
                        <div
                          id={`error-div-for-ad-param-${advancedParamIndex}-item-data-operation-form-${value.index}`}
                          style={{ display: 'none' }}
                        >
                          <img style={{ height: '15px' }} src={advice01} alt="" />
                          <p style={{ margin: '0 0 0 5px' }}>{errorMessages[advancedParam.dataType]}</p>
                        </div>
                      </div>
                    )))}
              </div>
            </div>
            )}
        </div>
      </div>
    </span>
  );
});


const SortableDataOperationsList = SortableContainer(({ items, prefix }) => (
  <ul style={{ paddingLeft: '11px' }} id="data-operations-selected-container" key="data-operations-selected-container">
    {items.map((value, index) => {
      value.index = index + 1;
      return (
        <SortableDataOperation key={`item-${index}`} value={value} index={index} prefix={prefix} />
      );
    })}
  </ul>
));

// this pressDelay avoid conflics with onClick events
export default (props) => <SortableDataOperationsList pressDelay={500} {...props} />;
