# train.py
import os
import argparse
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, StratifiedKFold, GridSearchCV
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
import joblib

# Optional: SMOTE
try:
    from imblearn.over_sampling import SMOTE
except Exception:
    SMOTE = None

def load_data(path):
    df = pd.read_csv(path)
    if 'Index' in df.columns:
        df = df.drop(columns=['Index'])
    X = df.drop(columns=['class'])
    # Map -1 => phishing (1), 1 => legitimate (0)
    y = df['class'].map({-1: 1, 1: 0}).astype(int)
    return X, y

def build_pipeline(model_name):
    if model_name == 'logistic':
        clf = LogisticRegression(class_weight='balanced', max_iter=2000, random_state=42)
    elif model_name == 'tree':
        clf = DecisionTreeClassifier(class_weight='balanced', random_state=42)
    else:
        clf = RandomForestClassifier(class_weight='balanced', n_jobs=-1, random_state=42)
    pipe = Pipeline([('scaler', StandardScaler()), ('clf', clf)])
    return pipe

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--data', required=True)
    parser.add_argument('--model', default='random_forest', choices=['logistic','tree','random_forest'])
    parser.add_argument('--outdir', default='outputs')
    parser.add_argument('--test-size', type=float, default=0.2)
    parser.add_argument('--gridsearch', action='store_true')
    parser.add_argument('--smote', action='store_true')
    args = parser.parse_args()

    os.makedirs(args.outdir, exist_ok=True)

    X, y = load_data(args.data)
    print("Loaded X shape:", X.shape, "y distribution:\n", y.value_counts())

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=args.test_size, stratify=y, random_state=42
    )

    if args.smote:
        if SMOTE is None:
            raise RuntimeError("Install imbalanced-learn to use --smote")
        sm = SMOTE(random_state=42)
        X_train, y_train = sm.fit_resample(X_train, y_train)
        print("After SMOTE, y_train distribution:", pd.Series(y_train).value_counts())

    pipeline = build_pipeline(args.model)

    if args.gridsearch:
        if args.model == 'random_forest':
            param_grid = {
                'clf__n_estimators': [100, 200],
                'clf__max_depth': [None, 10, 20],
                'clf__min_samples_split': [2, 5]
            }
        elif args.model == 'tree':
            param_grid = {
                'clf__max_depth': [None, 10, 20],
                'clf__min_samples_split': [2, 5, 10]
            }
        else:  # logistic
            param_grid = {
                'clf__C': [0.01, 0.1, 1, 10],
            }
        gs = GridSearchCV(pipeline, param_grid, cv=5, scoring='f1', n_jobs=-1, verbose=1)
        gs.fit(X_train, y_train)
        best = gs.best_estimator_
        print("Best params:", gs.best_params_)
    else:
        pipeline.fit(X_train, y_train)
        best = pipeline

    # Save the model
    model_path = os.path.join(args.outdir, f"model_{args.model}.joblib")
    joblib.dump(best, model_path)
    print("Saved model to:", model_path)

    # Evaluate
    y_pred = best.predict(X_test)
    y_prob = None
    if hasattr(best, "predict_proba"):
        y_prob = best.predict_proba(X_test)[:, 1]

    print("\nClassification report:\n", classification_report(y_test, y_pred, digits=4))
    print("Confusion matrix:\n", confusion_matrix(y_test, y_pred))
    metrics = {
        'accuracy': accuracy_score(y_test, y_pred),
        'precision': precision_score(y_test, y_pred, zero_division=0),
        'recall': recall_score(y_test, y_pred, zero_division=0),
        'f1': f1_score(y_test, y_pred, zero_division=0),
    }
    if y_prob is not None:
        try:
            metrics['roc_auc'] = roc_auc_score(y_test, y_prob)
        except Exception:
            metrics['roc_auc'] = None
    print("Metrics:", metrics)
    pd.Series(metrics).to_csv(os.path.join(args.outdir, "metrics.csv"))

    # Feature importance (if available)
    clf = best.named_steps['clf'] if 'clf' in best.named_steps else best
    feature_importances = None
    if hasattr(clf, "feature_importances_"):
        fi = clf.feature_importances_
        feature_importances = pd.Series(fi, index=X.columns).sort_values(ascending=False)
    elif hasattr(clf, "coef_"):
        coef = clf.coef_.ravel()
        feature_importances = pd.Series(np.abs(coef), index=X.columns).sort_values(ascending=False)
    if feature_importances is not None:
        feature_importances.to_csv(os.path.join(args.outdir, "feature_importances.csv"))
        print("Feature importances saved.")

if __name__ == "__main__":
    main()
