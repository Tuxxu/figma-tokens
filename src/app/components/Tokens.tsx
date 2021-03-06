import * as React from 'react';
import Modal from './Modal';
import Heading from './Heading';
import Icon from './Icon';
import EditTokenForm from './EditTokenForm';
import TokenButton from './TokenButton';
import Tooltip from './Tooltip';

const mappedTokens = (tokens) => {
    const properties = {
        sizing: {},
        spacing: {},
        colors: {},
        borderRadius: {},
        opacity: {},
    };
    return Object.entries(Object.assign(properties, tokens));
};

const Tokens = ({createStyles, setSingleTokenValue, setPluginValue, onUpdate, tokens, selectionValues, disabled}) => {
    const [editToken, setEditToken] = React.useState({
        token: '',
        name: '',
        path: '',
    });
    const [showEditForm, setShowEditForm] = React.useState(false);
    const [showOptions, setShowOptions] = React.useState('');

    const submitTokenValue = ({token, name, path}) => {
        setEditToken({token, name, path});
        setSingleTokenValue({name: [path, name].join('.'), token});
        onUpdate();
    };

    const showForm = ({token, name, path}) => {
        setShowEditForm(true);
        setEditToken({token, name, path});
    };

    const closeForm = () => {
        setShowOptions('');
        setShowEditForm(false);
    };

    const showNewForm = (path) => {
        showForm({token: '', name: '', path});
    };

    const renderKeyValue = ({tokenValues, path = '', type = '', editMode = false}) => (
        <div className="flex justify-start flex-row flex-wrap">
            {tokenValues.map((item) => {
                const [key, value] = item;
                const stringPath = [path, key].filter((n) => n).join('.');
                // const isActive = [path, key].join('.') === selectionValues[type];
                return (
                    <React.Fragment key={stringPath}>
                        {typeof value === 'object' ? (
                            <div className="property-wrapper w-full mt-2">
                                <Heading size="small">{key}</Heading>

                                {renderKeyValue({tokenValues: Object.entries(value), path: stringPath, type, editMode})}
                            </div>
                        ) : (
                            <div className="flex mb-1 mr-1">
                                <TokenButton
                                    type={type}
                                    editMode={editMode}
                                    name={key}
                                    path={path}
                                    token={value}
                                    disabled={disabled}
                                    setPluginValue={setPluginValue}
                                    showForm={showForm}
                                    selectionValues={selectionValues}
                                />
                            </div>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );

    const TokenListing = ({label, explainer = '', help = '', createButton = false, property, type = '', values}) => {
        const [showHelp, setShowHelp] = React.useState(false);
        return (
            <div className="mb-2 pb-2 border-b border-gray-200">
                <div className="flex justify-between space-x-4 items-center">
                    <Heading size="small">
                        {label}
                        {help && (
                            <Tooltip label={showHelp ? 'Hide help' : 'Show help'}>
                                <button className="ml-1" type="button" onClick={() => setShowHelp(!showHelp)}>
                                    <Icon name="help" />
                                </button>
                            </Tooltip>
                        )}
                    </Heading>
                    <div>
                        {createButton && (
                            <Tooltip label="Create Styles">
                                <button onClick={createStyles} type="button" className="button button-ghost">
                                    <Icon name="style" />
                                </button>
                            </Tooltip>
                        )}
                        <Tooltip label="Edit token values">
                            <button
                                className="button button-ghost"
                                type="button"
                                onClick={() => setShowOptions(values[0])}
                            >
                                <Icon name="edit" />
                            </button>
                        </Tooltip>
                        <Tooltip label="Add a new token">
                            <button
                                className="button button-ghost"
                                type="button"
                                onClick={() => {
                                    setShowOptions(values[0]);
                                    showNewForm(values[0]);
                                }}
                            >
                                <Icon name="add" />
                            </button>
                        </Tooltip>
                    </div>
                    {showOptions === values[0] && (
                        <Modal isOpen={showOptions} close={closeForm}>
                            <div className="flex flex-col-reverse">
                                {showEditForm && (
                                    <EditTokenForm
                                        explainer={explainer}
                                        submitTokenValue={submitTokenValue}
                                        initialName={editToken.name}
                                        path={editToken.path}
                                        property={property}
                                        isPristine={editToken.name === ''}
                                        initialToken={editToken.token}
                                        setShowEditForm={setShowEditForm}
                                    />
                                )}

                                <div className="mb-4">
                                    {renderKeyValue({
                                        tokenValues: Object.entries(values[1]),
                                        path: values[0],
                                        type,
                                        editMode: true,
                                    })}
                                </div>
                                <div className="flex items-center justify-between mb-4">
                                    <Heading size="small">{property}</Heading>
                                    <Tooltip label="Add a new token">
                                        <button
                                            type="button"
                                            className="button button-ghost"
                                            onClick={() => showNewForm(values[0])}
                                        >
                                            <Icon name="add" />
                                        </button>
                                    </Tooltip>
                                </div>
                            </div>
                        </Modal>
                    )}
                </div>
                {showHelp && <div className="mb-4 text-xxs text-gray-600">{help}</div>}
                {renderKeyValue({tokenValues: Object.entries(values[1]), path: values[0], type})}
            </div>
        );
    };

    const renderTokens = () => (
        <div>
            {mappedTokens(tokens).map((tokenValues) => {
                switch (tokenValues[0]) {
                    case 'borderRadius':
                        return (
                            <TokenListing
                                key={tokenValues[0]}
                                label="Border Radius"
                                property="Border Radius"
                                type="borderRadius"
                                values={tokenValues}
                            />
                        );
                    case 'opacity':
                        return (
                            <TokenListing
                                key={tokenValues[0]}
                                label="Opacity"
                                property="Opacity"
                                explainer="Set as 50%"
                                type="opacity"
                                values={tokenValues}
                            />
                        );
                    case 'colors':
                        return (
                            <div key={tokenValues[0]}>
                                <TokenListing
                                    createButton
                                    help="If a (local) style is found with the same name it will match to that, if not, will use hex value. Use 'Create Style' to batch-create styles from your tokens (e.g. in your design library). In the future we'll load all 'remote' styles and reference them inside the JSON."
                                    label="Fill"
                                    property="Fill"
                                    type="fill"
                                    values={tokenValues}
                                />
                            </div>
                        );
                    case 'sizing':
                        return (
                            <React.Fragment key={tokenValues[0]}>
                                <TokenListing label="Width" property="Sizing" type="width" values={tokenValues} />
                                <TokenListing label="Height" property="Sizing" type="height" values={tokenValues} />
                            </React.Fragment>
                        );
                    case 'spacing':
                        return (
                            <React.Fragment key={tokenValues[0]}>
                                <TokenListing property="Spacing" label="Spacing" type="spacing" values={tokenValues} />
                            </React.Fragment>
                        );
                    default:
                        return (
                            <TokenListing
                                key={tokenValues[0]}
                                property={tokenValues[0]}
                                label={tokenValues[0]}
                                values={tokenValues}
                                type={tokenValues[0]}
                            />
                        );
                }
            })}
        </div>
    );

    return <div>{renderTokens()}</div>;
};

export default Tokens;
